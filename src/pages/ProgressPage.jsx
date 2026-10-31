import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown, TrendingUp, Dumbbell, Utensils,
  Target, Flame, Activity, ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── helpers ───────────────────────────────────────────────────────
const pct = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0);

// Animated progress bar
const Bar = ({ value, color = "bg-green-500", delay = 0 }) => (
  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, delay, ease: "easeOut" }}
      className={`h-full ${color} rounded-full`}
    />
  </div>
);

// Animated ring
const Ring = ({ pct: p, color, size = 80, stroke = 7, label, sublabel }) => {
  const r    = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} stroke="#f3f4f6" strokeWidth={stroke} fill="none" />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            stroke={color} strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - p / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-sm font-black text-gray-800">{p}%</span>
      </div>
      <p className="text-xs font-black text-gray-700 text-center">{label}</p>
      {sublabel && <p className="text-[10px] text-gray-400 font-bold text-center">{sublabel}</p>}
    </div>
  );
};

// ── main component ────────────────────────────────────────────────
export default function ProgressPage() {
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const profile        = JSON.parse(localStorage.getItem("userProfile")      || "null");
      const plan           = JSON.parse(localStorage.getItem("user_active_plan") || "null");
      const mealChecked    = JSON.parse(localStorage.getItem("meal_checked")     || "{}");
      const workoutChecked = JSON.parse(localStorage.getItem("workout_checked")  || "{}");

      // ── weight ──
      const currentWeight = profile?.current_weight ?? null;
      const targetWeight  = profile?.target_weight  ?? null;
      const isLoss        = currentWeight !== null && targetWeight !== null && currentWeight > targetWeight;
      const weightDiff    = currentWeight !== null && targetWeight !== null
        ? Math.abs(currentWeight - targetWeight).toFixed(1)
        : null;

      // ── meals ──
      const allMeals = plan?.meals
        ? Object.values(plan.meals).flat()
        : [];
      const mealsTotal   = allMeals.length;
      const mealsDone    = allMeals.filter((m) => mealChecked[m.mealId]).length;
      const mealsPct     = pct(mealsDone, mealsTotal);

      // meals by type for breakdown
      const byType = {};
      allMeals.forEach((m) => {
        const t = m.mealTime ?? "OTHER";
        if (!byType[t]) byType[t] = { total: 0, done: 0 };
        byType[t].total++;
        if (mealChecked[m.mealId]) byType[t].done++;
      });

      // ── workouts ──
      const allExercises = plan?.workouts
        ? Object.values(plan.workouts).flat()
        : [];
      const exercisesTotal = allExercises.length;
      const exercisesDone  = allExercises.filter((e) => workoutChecked[e.exerciseId]).length;
      const exercisesPct   = pct(exercisesDone, exercisesTotal);

      // workouts per day
      const workoutDays = plan?.workouts ? Object.keys(plan.workouts).length : 0;
      const donePerDay  = plan?.workouts
        ? Object.entries(plan.workouts).map(([day, exs]) => ({
            day: Number(day),
            total: exs.length,
            done: exs.filter((e) => workoutChecked[e.exerciseId]).length,
          }))
        : [];

      // ── nutrition ──
      const nutrition = profile?.nutrition ?? null;

      setData({
        currentWeight, targetWeight, isLoss, weightDiff,
        mealsTotal, mealsDone, mealsPct, byType,
        exercisesTotal, exercisesDone, exercisesPct,
        workoutDays, donePerDay,
        nutrition,
        fitnessGoal:   profile?.fitness_goal   ?? null,
        experience:    profile?.experience_level ?? null,
        equipment:     profile?.equipment       ?? null,
        gender:        profile?.gender          ?? null,
        age:           profile?.age             ?? null,
        dailyCalories: plan?.dailyCalories      ?? null,
      });
    } catch (_) {}
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4 text-center p-8">
      <Activity size={40} className="text-gray-300" />
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No progress data yet</p>
      <button onClick={() => navigate("/home")} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wide">
        Go to Home
      </button>
    </div>
  );

  const MEAL_EMOJI  = { BREAKFAST: "🌅", LUNCH: "☀️", DINNER: "🌙", SNACK: "🍎" };
  const MEAL_ORDER  = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
  const GOAL_LABELS = { loss: "Weight Loss", gain: "Muscle Gain", maintenance: "Maintenance" };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 select-none">
      <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button onClick={() => navigate("/home")} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Activity className="text-green-600" size={18} /> Your Progress
          </h2>
          <div className="w-9" />
        </div>

        {/* ── Weight card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-5"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Current Weight</p>
              <h2 className="text-5xl font-black text-gray-900 font-mono mt-1">
                {data.currentWeight ?? "—"}
                <span className="text-lg text-gray-400 ml-1">kg</span>
              </h2>
            </div>
            <div className={`p-3.5 rounded-2xl ${data.isLoss ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-500"}`}>
              {data.isLoss ? <TrendingDown size={26} /> : <TrendingUp size={26} />}
            </div>
          </div>

          {data.weightDiff !== null && (
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Target Weight</p>
                <p className="text-2xl font-black text-gray-800 font-mono mt-0.5">
                  {data.targetWeight} kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">To Go</p>
                <p className={`text-2xl font-black font-mono mt-0.5 ${data.isLoss ? "text-green-600" : "text-blue-500"}`}>
                  {data.isLoss ? "-" : "+"}{data.weightDiff} kg
                </p>
              </div>
            </div>
          )}

          {/* weight progress bar */}
          {data.currentWeight && data.targetWeight && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-gray-400">
                <span>Start: {data.currentWeight} kg</span>
                <span>Goal: {data.targetWeight} kg</span>
              </div>
              <Bar
                value={Math.min(100, Math.round((Math.abs(data.currentWeight - data.targetWeight) / (data.currentWeight || 1)) * 100))}
                color={data.isLoss ? "bg-green-500" : "bg-blue-500"}
                delay={0.2}
              />
              <p className="text-[9px] text-gray-400 font-bold text-right">{data.weightDiff} kg remaining</p>
            </div>
          )}
        </motion.div>

        {/* ── Overall rings ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[28px] p-6 text-white"
        >
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-6">Plan Completion</p>
          <div className="flex justify-around">
            <Ring
              pct={data.mealsPct}
              color="#10b981"
              label="Meals"
              sublabel={`${data.mealsDone} / ${data.mealsTotal}`}
            />
            <Ring
              pct={data.exercisesPct}
              color="#818cf8"
              label="Workouts"
              sublabel={`${data.exercisesDone} / ${data.exercisesTotal}`}
            />
            <Ring
              pct={pct(data.mealsDone + data.exercisesDone, data.mealsTotal + data.exercisesTotal)}
              color="#f59e0b"
              label="Overall"
              sublabel="All tasks"
            />
          </div>
        </motion.div>

        {/* ── Meal breakdown ── */}
        {Object.keys(data.byType).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Utensils size={15} className="text-green-600" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meal Breakdown</p>
            </div>
            <div className="space-y-3">
              {MEAL_ORDER.filter((t) => data.byType[t]).map((type, i) => {
                const { total, done } = data.byType[type];
                const p = pct(done, total);
                return (
                  <div key={type} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-black text-gray-700">
                      <span>{MEAL_EMOJI[type] ?? "🍽️"} {type}</span>
                      <span className={p === 100 ? "text-green-600" : "text-gray-400"}>
                        {done}/{total}
                      </span>
                    </div>
                    <Bar
                      value={p}
                      color={p === 100 ? "bg-green-500" : "bg-emerald-300"}
                      delay={0.2 + i * 0.1}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Workout breakdown per day ── */}
        {data.donePerDay.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Dumbbell size={15} className="text-indigo-500" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Workout Breakdown</p>
            </div>
            <div className="space-y-3">
              {data.donePerDay.map(({ day, total, done }, i) => {
                const p = pct(done, total);
                return (
                  <div key={day} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-black text-gray-700">
                      <span>Day {day}</span>
                      <span className={p === 100 ? "text-indigo-600" : "text-gray-400"}>
                        {done}/{total} exercises
                      </span>
                    </div>
                    <Bar
                      value={p}
                      color={p === 100 ? "bg-indigo-500" : "bg-indigo-300"}
                      delay={0.25 + i * 0.1}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Nutrition targets ── */}
        {data.nutrition && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Flame size={15} className="text-orange-500" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Nutrition Targets</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Target Calories", val: data.dailyCalories ? Math.round(data.dailyCalories) : data.nutrition.targetCalories, unit: "kcal", color: "text-orange-500", bg: "bg-orange-50" },
                { label: "BMR",             val: data.nutrition.bmr,             unit: "kcal", color: "text-rose-500",   bg: "bg-rose-50"   },
                { label: "Protein",         val: data.nutrition.macros?.protein, unit: "g",    color: "text-blue-500",   bg: "bg-blue-50"   },
                { label: "Carbs",           val: data.nutrition.macros?.carbs,   unit: "g",    color: "text-amber-500",  bg: "bg-amber-50"  },
              ].map(({ label, val, unit, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4`}>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">{label}</p>
                  <p className={`text-xl font-black font-mono mt-1 ${color}`}>
                    {val ?? "—"}<span className="text-xs font-bold text-gray-400 ml-0.5">{unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Profile snapshot ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Target size={15} className="text-gray-600" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Profile Snapshot</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Goal",       val: GOAL_LABELS[data.fitnessGoal] ?? data.fitnessGoal },
              { label: "Experience", val: data.experience },
              { label: "Equipment",  val: data.equipment },
              { label: "Age",        val: data.age ? `${data.age} yrs` : null },
            ].filter((r) => r.val).map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-xs font-black text-gray-800 capitalize mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
