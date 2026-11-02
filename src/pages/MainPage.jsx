import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, Dumbbell,
  Sparkles, RefreshCw, Flame, CheckCircle
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const PLAN_API = "https://gp-backend-production-7b9a.up.railway.app/api";

const toBackendActivityLevel = (level) => {
  if (!level) return level;
  const map = {
    "sedentary":    "SEDENTARY",
    "light":        "LIGHT",
    "moderate":     "MODERATE",
    "active":       "ACTIVE",
    "extra active": "EXTRA_ACTIVE",
  };
  return map[level?.toLowerCase()] ?? level.toUpperCase().replace(/ /g, "_");
};

const toBackendEquipment = (val) => {
  if (!val) return val;
  const map = {
    "gym":            "FULL_GYM",
    "at home":        "AT_HOME",
    "full equipment": "GARAGE_GYM",
  };
  return map[val?.toLowerCase()] ?? val.toUpperCase().replace(/ /g, "_");
};

const toBackendExperience = (val) => {
  if (!val) return val;
  return val.toUpperCase(); // "beginner" → "BEGINNER", etc.
};

const toBackendGender = (val) => {
  if (!val) return val;
  return val.toUpperCase(); // "male" → "MALE", "female" → "FEMALE"
};

const getToken   = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export default function MainPage() {
  const navigate = useNavigate();

  const [userName,         setUserName]         = useState("");
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [generating,       setGenerating]       = useState(false);
  const [loadingPlan,      setLoadingPlan]       = useState(true);
  const [plan,             setPlan]             = useState(null);
  const [isMealsOpen,      setIsMealsOpen]      = useState(true);
  const [isWorkoutOpen,    setIsWorkoutOpen]    = useState(true);
  const [isTimerRunning,   setIsTimerRunning]   = useState(false);
  const [seconds,          setSeconds]          = useState(45 * 60);
  const hasFetchedPlan = useRef(false);

  useEffect(() => {
    if (!getToken()) { navigate("/login"); return; }
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    setUserName(userObj.fullname || "Athlete");

    const localPlan = localStorage.getItem("user_active_plan");
    if (localPlan) {
      try { setPlan(JSON.parse(localPlan)); } catch (_) {}
    }
    fetchExistingPlan();
  }, []);

  const fetchExistingPlan = async () => {
    if (hasFetchedPlan.current) return;
    hasFetchedPlan.current = true;
    setLoadingPlan(true);
    try {
      const res = await axios.get(`${PLAN_API}/current`, {
        headers: authHeader(),
        timeout: 15000,
      });
      if (res.data) {
        setPlan(res.data);
        localStorage.setItem("user_active_plan", JSON.stringify(res.data));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
        return;
      }
      console.warn("fetchExistingPlan:", err.response?.status, err.message);
    } finally {
      setLoadingPlan(false);
    }
  };

  // ── Timer ──
  useEffect(() => {
    let interval;
    if (isTimerRunning && seconds > 0) {
      interval = setInterval(() => setSeconds((p) => p - 1), 1000);
    } else if (seconds === 0) {
      toast.success("Workout session complete! 🎉");
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, seconds]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Generate Plan ──
  const handleGeneratePlan = async () => {
    if (!getToken()) { toast.error("Please log in first."); navigate("/login"); return; }
    setGenerating(true);
    try {
      const localProfile = (() => {
        try { return JSON.parse(localStorage.getItem("userProfile") || "null"); } catch { return null; }
      })();
      const body = localProfile ? {
        age: localProfile.age,
        gender:            toBackendGender(localProfile.gender),
        height: localProfile.height, current_weight: localProfile.current_weight,
        target_weight: localProfile.target_weight,
        active_level:      toBackendActivityLevel(localProfile.active_level),
        fitness_goal:      localProfile.fitness_goal,
        experience_level:  toBackendExperience(localProfile.experience_level),
        equipment:         toBackendEquipment(localProfile.equipment),
      } : {};

      console.log("📤 Plan POST body:", JSON.stringify(body, null, 2));

      const res = await axios.post(
        `${PLAN_API}/plan/${selectedDuration}`,
        body,
        { headers: { ...authHeader(), "Content-Type": "application/json" }, timeout: 60000 }
      );
      setPlan(res.data);
      localStorage.setItem("user_active_plan", JSON.stringify(res.data));
      console.log("✅ Plan data:", JSON.stringify(res.data, null, 2));
      toast.success(`✅ ${selectedDuration}-Day plan generated!`);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
      } else if (err.response?.status === 500) {
        toast.error("❌ Plan generation failed. Make sure your profile is complete.");
      } else if (err.response?.status === 404) {
        toast.error("Plan endpoint not found.");
      } else if (err.code === "ECONNABORTED" || err.message === "Network Error") {
        toast.error("Plan server is currently unavailable. Please try again in a moment.");
      } else {
        toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to generate plan.");
      }
      console.error("Generate plan error:", err.response?.data || err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ── Reset Plan ──
  const handleResetPlan = async () => {
    try {
      await axios.delete(`${PLAN_API}/plan`, { headers: authHeader(), timeout: 10000 });
    } catch (_) {}
    setPlan(null);
    localStorage.removeItem("user_active_plan");
    setSeconds(45 * 60);
    setIsTimerRunning(false);
  };

  // ── Greeting ──
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // ── Normalise plan shape ──

  const rawMeals = plan?.dietPlan?.meals ?? plan?.meals ?? [];
  const meals = Array.isArray(rawMeals)
    ? rawMeals
    : Object.values(rawMeals).flat();

  const rawWorkouts = plan?.workoutPlan?.exercises ?? plan?.workouts ?? plan?.exercises ?? [];
  const exercises = Array.isArray(rawWorkouts)
    ? rawWorkouts
    : Object.values(rawWorkouts).flat();

  const targetCalories  = plan?.dailyCalories ?? plan?.targetCalories ?? plan?.dietPlan?.targetCalories ?? null;
  const caloriesBurn    = plan?.workoutPlan?.caloriesBurn ?? plan?.caloriesBurn ?? null;

  // ── Loading screen ──
  if (loadingPlan) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading your plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 select-none">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">

        {/* ── Greeting bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm"
        >
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{greeting}</p>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Hello, <span className="text-green-600">{userName}</span> 👋
            </h2>
          </div>
          {plan && (
            <button
              onClick={handleResetPlan}
              className="p-2.5 bg-red-50 hover:bg-red-100 text-red-400 rounded-xl transition-all"
              title="Reset plan"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </motion.div>

        {/* ── STATE 1: No plan ── */}
        {!plan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl space-y-8 mt-6 text-center"
          >
            <div>
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={30} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Build Your AI Plan</h2>
              <p className="text-xs font-semibold text-gray-400 mt-1">
                Choose how many days — we'll generate your diet & workout automatically.
              </p>
            </div>

            {/* Duration slider */}
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Duration</span>
                <span className="text-lg font-black text-green-600 font-mono bg-white px-4 py-1 rounded-xl shadow-sm">
                  {selectedDuration} {selectedDuration === 1 ? "Day" : "Days"}
                </span>
              </div>
              <input
                type="range" min="1" max="7"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full accent-gray-900 h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-black text-gray-400 px-0.5">
                {[1,2,3,4,5,6,7].map(d => (
                  <span key={d} className={selectedDuration === d ? "text-green-600" : ""}>{d}</span>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Generating...</>
              ) : (
                <><Sparkles size={16} className="text-amber-400" /> Generate My AI Plan</>
              )}
            </button>
          </motion.div>

        ) : (
        /* ── STATE 2: Plan exists ── */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Calories card */}
              <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[28px] p-7 text-white shadow-xl flex flex-col justify-between min-h-[160px]">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-white/10 px-3 py-1 rounded-full">
                    Daily Target
                  </span>
                  <h2 className="text-5xl font-black mt-4 tracking-tight">
                    {targetCalories ?? "—"}
                    <span className="text-sm font-bold text-green-400 ml-2">kcal / day</span>
                  </h2>
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider border-t border-white/10 pt-3 mt-4">
                  AI-Synchronized Diet Plan
                </p>
              </div>

              {/* Timer card */}
              <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                    <circle
                      cx="60" cy="60" r="52"
                      stroke="#10b981" strokeWidth="6" fill="none"
                      strokeDasharray={326.7}
                      strokeDashoffset={326.7 - (326.7 * (seconds / (45 * 60)))}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <span className="absolute text-xl font-black text-gray-800 font-mono">{formatTime(seconds)}</span>
                </div>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wide hover:bg-gray-800 transition-all"
                >
                  {isTimerRunning ? "Pause" : "Start Timer"}
                </button>
              </div>
            </div>

            {/* Meals accordion */}
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsMealsOpen(!isMealsOpen)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-base font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                  🍽️ Today's Meals
                </span>
                {isMealsOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              <AnimatePresence>
                {isMealsOpen && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gray-50"
                  >
                    <div className="p-5 space-y-3">
                      {meals.length > 0 ? meals.map((meal, i) => (
                        <div key={meal.mealId ?? i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              {meal.mealTime ?? meal.meal_type ?? meal.id ?? meal.time ?? `Meal ${i + 1}`}
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {meal.name ?? meal.food ?? meal.description ?? "—"}
                            </p>
                            {meal.ingredients && (
                              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{meal.ingredients}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg block">
                              {meal.calories ?? meal.cal ?? "—"} kcal
                            </span>
                            {(meal.protein || meal.carbs || meal.fats) && (
                              <p className="text-[9px] text-gray-400 mt-1 font-mono">
                                P:{meal.protein}g C:{meal.carbs}g F:{meal.fats}g
                              </p>
                            )}
                          </div>
                        </div>
                      )) : (
                        <p className="text-center text-sm text-gray-400 py-4">No meals data in this plan.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Workout accordion */}
            <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setIsWorkoutOpen(!isWorkoutOpen)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-base font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                  <Dumbbell size={18} className="text-green-600" /> Today's Workout
                </span>
                <div className="flex items-center gap-3">
                  {caloriesBurn && (
                    <span className="text-xs font-black text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Flame size={12} /> {caloriesBurn} kcal
                    </span>
                  )}
                  {isWorkoutOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </button>
              <AnimatePresence>
                {isWorkoutOpen && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                    className="overflow-hidden border-t border-gray-50"
                  >
                    <div className="p-5 space-y-3">
                      {exercises.length > 0 ? (
                        <>
                          {exercises.map((ex, i) => (
                            <div key={ex.exerciseId ?? ex.id ?? i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div>
                                <p className="text-sm font-bold text-gray-800">{ex.exerciseName ?? ex.name ?? ex.title ?? "—"}</p>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">
                                  {ex.sets} sets × {ex.reps} reps
                                  {ex.intensity ? ` · intensity ${ex.intensity}/10` : ""}
                                  {ex.durationMinutes || ex.min ? ` · ${ex.durationMinutes ?? ex.min} min` : ""}
                                </p>
                              </div>
                              <CheckCircle size={16} className="text-gray-200" />
                            </div>
                          ))}
                          <button
                            onClick={() => navigate("/workout")}
                            className="w-full mt-1 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                          >
                            <Dumbbell size={14} /> Go to Full Workout
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-400 mb-3">No workout data in this plan.</p>
                          <button
                            onClick={() => navigate("/workout")}
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wide hover:bg-gray-800 transition-all"
                          >
                            Open Workout Page
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}

