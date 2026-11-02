import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify";

import { onboardingSchema } from "../schema/onboardingSchema";

const AUTH_API = "https://trying-task.vercel.app";
const GP_API   = "https://gp-backend-production-7b9a.up.railway.app/api";

function calculateNutrition(p) {
  const age = Number(p.age) || 25;
  const w   = Number(p.current_weight) || 80;
  const h   = Number(p.height) || 175;
  let bmr   = 10 * w + 6.25 * h - 5 * age;
  bmr += p.gender === "male" ? 5 : -161;
  const multipliers = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725, "extra active":1.9 };
  const tdee = bmr * (multipliers[p.active_level] || 1.2);
  let cal = tdee;
  if (p.fitness_goal === "weight loss") cal -= 400;
  else if (["bodybuilding","powerlifting"].includes(p.fitness_goal)) cal += 300;
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), targetCalories: Math.round(cal),
    macros: { protein: Math.round((cal*.3)/4), carbs: Math.round((cal*.45)/4), fat: Math.round((cal*.25)/9) },
  };
}

export default function OnboardingSlider() {
  const [step, setStep]                     = useState(1);
  const [isLoading, setIsLoading]           = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/login"); return; }
      try {
        const localRaw = localStorage.getItem("userProfile");
        if (localRaw) {
          const local = JSON.parse(localRaw);
          if (local?.age) { navigate("/main", { replace: true }); return; }
        }
        const res = await axios.get(`${AUTH_API}/getProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.age) {
          localStorage.setItem("userProfile", JSON.stringify(res.data));
          navigate("/main", { replace: true });
        }
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (err.response?.status !== 404) {
          console.error("checkExistingProfile error:", err.message);
        }
      } finally {
        setCheckingStatus(false);
      }
    };
    checkExistingProfile();
  }, [navigate]);

  const { control, trigger, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      gender: "", age: "", height: "",
      currentWeight: "", targetWeight: "",
      activity: "", goal: "", equipment: "",
      experience_level: "",
    },
    resolver: zodResolver(onboardingSchema),
  });

  const f = watch();

  const TOTAL_STEPS = 4;

  const nextStep = async () => {
    const fieldsMap = {
      1: ["gender","age","currentWeight","targetWeight","height","activity"],
      2: ["goal"],
      3: ["equipment"],
    };
    const isValid = await trigger(fieldsMap[step] || []);
    if (isValid) setStep((p) => p + 1);
  };

  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Session expired."); navigate("/login"); return; }

    setIsLoading(true);

    const profileData = {
      age:              Number(f.age),
      gender:           f.gender.toUpperCase(),                                                                           // "male" → "MALE"
      height:           Number(f.height),
      current_weight:   Number(f.currentWeight),
      target_weight:    Number(f.targetWeight),
      active_level:     { "sedentary":"SEDENTARY","light":"LIGHT","moderate":"MODERATE","active":"ACTIVE","extra active":"EXTRA_ACTIVE" }[f.activity]     ?? f.activity.toUpperCase().replace(/ /g,"_"),
      fitness_goal:     { "weight loss":"LOSE_WEIGHT","maintenance":"ATHLETICS","bodybuilding":"BODYBUILDING","powerlifting":"POWERLIFTING" }[f.goal]      ?? f.goal.toUpperCase().replace(/ /g,"_"),
      experience_level: (f.experience_level || "beginner").toUpperCase(),                                                 // "beginner" → "BEGINNER"
      equipment:        { "gym":"FULL_GYM","at home":"AT_HOME","full equipment":"GARAGE_GYM" }[f.equipment]               ?? f.equipment.toUpperCase().replace(/ /g,"_"),
    };

    const localProfile = {
      age:              Number(f.age),
      gender:           f.gender,
      height:           Number(f.height),
      current_weight:   Number(f.currentWeight),
      target_weight:    Number(f.targetWeight),
      active_level:     f.activity,
      fitness_goal:     f.goal,
      experience_level: f.experience_level || "beginner",
      equipment:        f.equipment,
    };

    try {
      const addRes = await axios.post(`${AUTH_API}/addprofile`, profileData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log("addprofile response:", addRes.data);

      localStorage.setItem("hasProfile", "true");

      const nutrition = calculateNutrition(localProfile);
      localStorage.setItem("userProfile", JSON.stringify({ ...localProfile, nutrition }));

      toast.success("Profile saved! Let's get started 🎯");
      navigate("/main", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired."); localStorage.clear(); navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to save profile.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-black text-green-600 text-sm uppercase tracking-widest">
        Checking account status...
      </div>
    );
  }

  const stepLabels = ["Body Stats", "Your Goal", "Equipment", "Experience"];

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col justify-between p-6 font-sans selection:bg-green-100">

      {/* ── Progress Header ── */}
      <div className="max-w-md mx-auto w-full pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider">Setup Profile</h1>
            <p className="text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
              Step {step} of {TOTAL_STEPS} — {stepLabels[step - 1]}
            </p>
          </div>
          <span className="text-xs font-black bg-gray-100 px-3 py-1.5 rounded-xl text-gray-500">
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-600 rounded-full"
            initial={{ width: `${(1/TOTAL_STEPS)*100}%` }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* ── Form Body ── */}
      <div className="flex-1 flex items-center justify-center py-8">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Body Stats ── */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="max-w-md w-full space-y-5">

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Gender</label>
                <div className="flex gap-3">
                  <GenderBtn active={f.gender==="male"}   label="Male"   icon="♂" onClick={() => setValue("gender","male",   {shouldValidate:true})} />
                  <GenderBtn active={f.gender==="female"} label="Female" icon="♀" onClick={() => setValue("gender","female", {shouldValidate:true})} />
                </div>
                {errors.gender && <p className="text-red-500 text-xs font-bold ml-1">{errors.gender.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller name="age"    control={control} render={({field}) => <InputGroup label="Age (Years)"  type="number" placeholder="e.g. 22"  error={errors.age?.message}    {...field} />} />
                <Controller name="height" control={control} render={({field}) => <InputGroup label="Height (CM)"  type="number" placeholder="e.g. 175" error={errors.height?.message} {...field} />} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Controller name="currentWeight" control={control} render={({field}) => <InputGroup label="Current Weight (KG)" type="number" placeholder="e.g. 85" error={errors.currentWeight?.message} {...field} />} />
                <Controller name="targetWeight"  control={control} render={({field}) => <InputGroup label="Target Weight (KG)"  type="number" placeholder="e.g. 75" error={errors.targetWeight?.message}  {...field} />} />
              </div>

              <OptionSelector
                label="Activity Level"
                value={f.activity}
                onChange={(val) => setValue("activity", val, {shouldValidate:true})}
                options={[
                  { id:"sedentary",    title:"Sedentary",    desc:"Little to no exercise / Desk job" },
                  { id:"light",        title:"Light",        desc:"Light exercise 1–3 days/week" },
                  { id:"moderate",     title:"Moderate",     desc:"Moderate exercise 3–5 days/week" },
                  { id:"active",       title:"Active",       desc:"Hard exercise 6–7 days/week" },
                  { id:"extra active", title:"Extra Active", desc:"Physical job + daily training" },
                ]}
              />
              {errors.activity && <p className="text-red-500 text-xs font-bold ml-1">{errors.activity.message}</p>}
            </motion.div>
          )}

          {/* ── Step 2: Goal ── */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="max-w-md w-full space-y-6">
              <OptionSelector
                label="Your Main Goal"
                value={f.goal}
                onChange={(val) => setValue("goal", val, {shouldValidate:true})}
                options={[
                  { id:"weight loss",  title:"Lose Weight",     desc:"Burn fat, lean down & calorie deficit" },
                  { id:"maintenance",  title:"Maintain Weight", desc:"Stay fit, optimize energy & hold weight" },
                  { id:"bodybuilding", title:"Build Muscle",    desc:"Bulk up, build strength & calorie surplus" },
                  { id:"powerlifting", title:"Powerlifting",    desc:"Max strength & heavy compound lifts" },
                ]}
              />
              {errors.goal && <p className="text-red-500 text-xs font-bold ml-1">{errors.goal.message}</p>}
            </motion.div>
          )}

          {/* ── Step 3: Equipment ── */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="max-w-md w-full space-y-6">
              <OptionSelector
                label="Preferred Workout Location"
                value={f.equipment}
                onChange={(val) => setValue("equipment", val, {shouldValidate:true})}
                options={[
                  { id:"gym",            title:"Commercial Gym",      desc:"Free weights & full machinery" },
                  { id:"at home",        title:"Home / Calisthenics", desc:"Bodyweight & minimal equipment" },
                  { id:"full equipment", title:"Garage Gym",          desc:"Basic home setup & dumbbells" },
                ]}
              />
              {errors.equipment && <p className="text-red-500 text-xs font-bold ml-1">{errors.equipment.message}</p>}
            </motion.div>
          )}

          {/* ── Step 4: Experience Level ── */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="max-w-md w-full space-y-6">

              <OptionSelector
                label="Training Experience"
                value={f.experience_level}
                onChange={(val) => setValue("experience_level", val, {shouldValidate:true})}
                options={[
                  { id:"beginner",     title:"Beginner",     desc:"Less than 1 year of consistent training" },
                  { id:"intermediate", title:"Intermediate", desc:"1–3 years of regular training" },
                  { id:"advanced",     title:"Advanced",     desc:"3+ years, know your way around any gym" },
                ]}
              />
              {errors.experience_level && <p className="text-red-500 text-xs font-bold ml-1">{errors.experience_level.message}</p>}

              {/* Summary Card */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Profile Summary</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-700">
                  <span>🧍 {f.gender || "—"} · {f.age || "—"} yrs</span>
                  <span>📏 {f.height || "—"} cm</span>
                  <span>⚖️ {f.currentWeight || "—"} → {f.targetWeight || "—"} kg</span>
                  <span>🎯 {f.goal || "—"}</span>
                  <span>🏋️ {f.equipment || "—"}</span>
                  <span>⚡ {f.activity || "—"}</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Footer Navigation ── */}
      <div className="max-w-md mx-auto w-full flex gap-3 pb-4">
        {step > 1 && (
          <button type="button" disabled={isLoading} onClick={prevStep}
            className="h-16 px-6 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 active:scale-95 font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50">
            Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button type="button" onClick={nextStep}
            className="flex-1 h-16 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            Continue
          </button>
        ) : (
          <button type="button" disabled={isLoading} onClick={handleSubmit}
            className="flex-1 h-16 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2">
            {isLoading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
              : "Save My Information →"}
          </button>
        )}
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InputGroup({ label, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input {...props} className={`w-full p-4 bg-gray-50 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${error ? "border-red-400 bg-red-50" : "border-transparent focus:border-green-600"}`} />
      {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
    </div>
  );
}

function GenderBtn({ active, label, icon, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 p-4 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all font-black uppercase text-xs ${active ? "bg-gray-900 border-gray-900 text-white shadow-xl" : "bg-gray-50 border-transparent text-gray-400"}`}>
      <span className="text-base">{icon}</span> {label}
    </button>
  );
}

function OptionSelector({ label, value, options, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <button key={opt.id} type="button" onClick={() => onChange(opt.id)}
            className={`w-full p-4 rounded-2xl border-2 font-black transition-all flex justify-between items-center text-left ${value === opt.id ? "bg-white border-gray-950 shadow-md" : "bg-gray-50 border-transparent"}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-gray-900">{opt.title}</p>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            {value === opt.id && <span className="text-green-600 text-sm">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
