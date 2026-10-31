import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Activity, TrendingDown, Clock, Dumbbell,
  AlertTriangle, CheckCircle, Utensils, Target, Flame,
} from "lucide-react";

// ── BMI category helper ───────────────────────────────────────────
const bmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500",   bg: "bg-blue-50"   };
  if (bmi < 25)   return { label: "Normal",       color: "text-green-600",  bg: "bg-green-50"  };
  if (bmi < 30)   return { label: "Overweight",   color: "text-amber-500",  bg: "bg-amber-50"  };
  return             { label: "Obese",          color: "text-red-500",    bg: "bg-red-50"    };
};

// ── activity level multipliers ───────────────────────────────────
const ACTIVITY_LABELS = {
  sedentary: "Sedentary",
  light:     "Lightly Active",
  moderate:  "Moderately Active",
  active:    "Very Active",
  very_active: "Extra Active",
};

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9,
};

export default function StatusPage() {
  const navigate = useNavigate();
  const [loading, setLoading]   = useState(true);
  const [profile, setProfile]   = useState(null);
  const [plan,    setPlan]       = useState(null);
  const [mealChecked, setMealChecked] = useState({});
  const [workoutChecked, setWorkoutChecked] = useState({});

  useEffect(() => {
    try {
      const p  = localStorage.getItem("userProfile");
      const pl = localStorage.getItem("user_active_plan");
      const mc = localStorage.getItem("meal_checked");
      const wc = localStorage.getItem("workout_checked");
      if (p)  setProfile(JSON.parse(p));
      if (pl) setPlan(JSON.parse(pl));
      if (mc) setMealChecked(JSON.parse(mc));
      if (wc) setWorkoutChecked(JSON.parse(wc));
    } catch (_) {}
    setLoading(false);
  }, []);

  // ── derived values ───────────────────────────────────────────────
  const cw = profile?.current_weight ?? 0;
  const tw = profile?.target_weight  ?? 0;
  const h  = (profile?.height ?? 170) / 100;
  const bmi = h > 0 ? Math.round((cw / (h * h)) * 10) / 10 : 0;
  const cat = bmiCategory(bmi);

  const weightGoal = Math.abs(cw - tw);
  const isLoss     = cw > tw;

  // weight progress: how much has been "conceptually planned" toward goal
  // We show current vs target as a progress bar
  const weightProgress = cw === tw ? 100
    : isLoss
      ? Math.min(100, Math.round(((cw - tw) / (cw - tw)) * 100)) // starts at 0 on generation
      : 0;

  // BMI gauge (range 10–40)
  const bmiPct = Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);
  const pointerRot = (bmiPct / 100) * 180 - 90;

  // nutrition from profile
  const bmr          = profile?.nutrition?.bmr           ?? null;
  const tdee         = profile?.nutrition?.tdee          ?? null;
  const targetCal    = profile?.nutrition?.targetCalories ?? plan?.dailyCalories ?? null;
  const macros       = profile?.nutrition?.macros        ?? null;
  const actLevel     = profile?.active_level             ?? null;
  const actMult      = ACTIVITY_MULTIPLIERS[actLevel]    ?? null;

  // meal progress from checked state
  const allMeals = plan?.meals
    ? Object.values(plan.meals).flat()
    : [];
  const checkedMealCount = allMeals.filter((m) => mealChecked[m.mealId]).length;
  const mealProgress = allMeals.length > 0
    ? Math.round((checkedMealCount / allMeals.length) * 100)
    : 0;

  // workout progress from checked state
  const allExercises = plan?.workouts
    ? Object.values(plan.workouts).flat()
    : [];
  const checkedExCount = allExercises.filter((e) => workoutChecked[e.exerciseId]).length;
  const workoutProgress = allExercises.length > 0
    ? Math.round((checkedExCount / allExercises.length) * 100)
    : 0;

  // ── mini ring component ──────────────────────────────────────────
  const Ring = ({ pct, color, size = 56, stroke = 5 }) => {
    const r   = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#f3f4f6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 select-none">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button onClick={() => navigate("/home")} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="text-base font-black tracking-tight flex items-center gap-2 uppercase">
            <Activity className="text-green-600" size={18} /> Health Report
          </h2>
          <div className="w-9" />
        </div>

        {/* ── Today's Progress row ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Meals progress */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="relative flex items-center justify-center shrink-0">
              <Ring pct={mealProgress} color="#10b981" />
              <span className="absolute text-[11px] font-black text-gray-800">{mealProgress}%</span>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today's Meals</p>
              <p className="text-lg font-black text-gray-800 font-mono mt-0.5">
                {checkedMealCount}
                <span className="text-gray-400 text-sm"> / {allMeals.length}</span>
              </p>
              <p className="text-[10px] text-green-600 font-bold mt-0.5">
                {mealProgress === 100 ? "All done! 🎉" : "Mark meals eaten"}
              </p>
            </div>
          </div>

          {/* Workout progress */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="relative flex items-center justify-center shrink-0">
              <Ring pct={workoutProgress} color="#6366f1" />
              <span className="absolute text-[11px] font-black text-gray-800">{workoutProgress}%</span>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Workout</p>
              <p className="text-lg font-black text-gray-800 font-mono mt-0.5">
                {checkedExCount}
                <span className="text-gray-400 text-sm"> / {allExercises.length}</span>
              </p>
              <p className="text-[10px] text-indigo-500 font-bold mt-0.5">
                {workoutProgress === 100 ? "Crushed it! 💪" : "Log exercises"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main two-col grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Metrics card */}
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-4">
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block">Metrics Summary</span>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Daily Target</span>
                <span className="text-xl font-black text-gray-800 font-mono flex items-baseline gap-1 mt-1">
                  {targetCal ? Math.round(targetCal) : "—"}
                  <span className="text-[10px] font-bold text-gray-400">kcal</span>
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">BMR</span>
                <span className="text-xl font-black text-gray-800 font-mono flex items-baseline gap-1 mt-1">
                  {bmr ?? "—"}
                  <span className="text-[10px] font-bold text-gray-400">kcal</span>
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {/* Weight goal */}
              <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-xl"><TrendingDown size={14} /></div>
                  <span className="text-[10px] font-black text-gray-700 uppercase">Weight Goal</span>
                </div>
                <span className="text-sm font-black text-gray-900 font-mono">
                  {isLoss ? "-" : "+"}{weightGoal.toFixed(1)} kg
                </span>
              </div>

              {/* Current vs Target weight bar */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-gray-500">
                  <span>Current: {cw} kg</span>
                  <span>Target: {tw} kg</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(Math.abs((cw - tw) / (cw || 1)) * 100))}%` }}
                  />
                </div>
                <p className="text-[9px] text-gray-400 font-bold text-right">{weightGoal.toFixed(1)} kg to go</p>
              </div>

              {/* Activity */}
              <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><Dumbbell size={14} /></div>
                  <span className="text-[10px] font-black text-gray-700 uppercase">Activity Level</span>
                </div>
                <span className="text-[10px] font-black text-gray-900">
                  {ACTIVITY_LABELS[actLevel] ?? actLevel ?? "—"}
                  {actMult && <span className="text-gray-400 font-mono ml-1">×{actMult}</span>}
                </span>
              </div>

              {/* TDEE */}
              {tdee && (
                <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-xl"><Flame size={14} /></div>
                    <span className="text-[10px] font-black text-gray-700 uppercase">TDEE</span>
                  </div>
                  <span className="text-sm font-black text-gray-900 font-mono">{tdee} kcal</span>
                </div>
              )}
            </div>
          </div>

          {/* BMI gauge card */}
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-between min-h-[300px]">
            <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest block w-full text-left">
              Body Mass Index
            </span>

            {/* Gauge */}
            <div className="relative w-52 h-28 flex items-end justify-center overflow-hidden mt-2">
              <svg className="absolute bottom-0 w-full h-52 rotate-180" viewBox="0 0 208 208">
                <circle cx="104" cy="104" r="88" stroke="#f3f4f6" strokeWidth="14" fill="none"
                  strokeDasharray="276" strokeDashoffset="276" strokeLinecap="round" />
                {/* color zones */}
                <circle cx="104" cy="104" r="88" stroke="#3b82f6" strokeWidth="14" fill="none"
                  strokeDasharray="276" strokeDashoffset={276 - 276 * 0.28} strokeLinecap="round" opacity="0.6" />
                <circle cx="104" cy="104" r="88" stroke="#10b981" strokeWidth="14" fill="none"
                  strokeDasharray="276" strokeDashoffset={276 - 276 * 0.55}
                  strokeLinecap="round" opacity="0.7"
                  style={{ strokeDashoffset: 276 - 276 * 0.27 }}
                />
                {/* actual value arc */}
                <circle cx="104" cy="104" r="88" stroke="#111827" strokeWidth="4" fill="none"
                  strokeDasharray="276"
                  strokeDashoffset={276 - 276 * (bmiPct / 100)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              {/* needle */}
              <div
                className="absolute bottom-0 w-1 bg-gray-900 h-20 origin-bottom rounded-t-full transition-transform duration-1000"
                style={{ transform: `rotate(${pointerRot}deg)` }}
              >
                <div className="w-2 h-2 bg-gray-900 rounded-full -ml-0.5 -mt-1" />
              </div>
              <div className="absolute bottom-0 w-4 h-2 bg-gray-900 rounded-t-full z-10" />
            </div>

            <div className="text-center mt-3">
              <span className="text-4xl font-black text-gray-900 font-mono">{bmi}</span>
              <span className={`ml-2 text-xs font-black px-2.5 py-1 rounded-lg ${cat.bg} ${cat.color}`}>
                {cat.label}
              </span>
              <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Current BMI</p>
            </div>

            <div className="w-full flex justify-between text-[9px] font-black text-gray-400 px-4 mt-2 border-t border-gray-50 pt-3">
              <span className="text-blue-400">↑ Under 18.5</span>
              <span className="text-green-500">18.5 – 25</span>
              <span className="text-amber-400">25 – 30 ↑</span>
            </div>
          </div>
        </div>

        {/* ── Macros targets ── */}
        {macros && (
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-5">
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mb-4">Daily Macro Targets</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Protein", val: macros.protein, unit: "g", color: "bg-blue-500", light: "bg-blue-50 text-blue-600" },
                { label: "Carbs",   val: macros.carbs,   unit: "g", color: "bg-amber-400", light: "bg-amber-50 text-amber-600" },
                { label: "Fat",     val: macros.fat,     unit: "g", color: "bg-rose-400",  light: "bg-rose-50 text-rose-600"  },
              ].map(({ label, val, unit, color, light }) => (
                <div key={label} className={`${light} rounded-2xl p-4 text-center`}>
                  <p className="text-[9px] font-black uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-black font-mono mt-1">{val}<span className="text-xs font-bold ml-0.5">{unit}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Alert / OK banner ── */}
        {targetCal !== null && (
          targetCal < 1400 ? (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3 text-amber-900">
              <AlertTriangle className="text-amber-600 shrink-0" size={18} />
              <p className="text-xs font-bold leading-tight">
                Calorie target is below 1400 kcal — consider a slower pace or consult your nutrition AI to maintain muscle mass.
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 text-emerald-900">
              <CheckCircle className="text-emerald-600 shrink-0" size={18} />
              <p className="text-xs font-bold leading-tight">
                Your calorie budget is optimized for sustainable progress and peak metabolic performance.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
}
