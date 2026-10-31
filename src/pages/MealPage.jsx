import React, { useState, useEffect } from "react";
import { Flame, Utensils, ChevronLeft, Droplets, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── helpers ──────────────────────────────────────────────────────
const MEAL_ORDER = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
const MEAL_EMOJI = { BREAKFAST: "🌅", LUNCH: "☀️", DINNER: "🌙", SNACK: "🍎" };

const normaliseMeals = (raw) => {
  if (!raw) return [];
  // raw can be { "1": [...], "2": [...] } or already an array
  const allDays = Array.isArray(raw) ? { 1: raw } : raw;
  // return { dayNumber: [...meals] }
  return allDays;
};

export default function MealPage() {
  const navigate = useNavigate();
  const [mealsByDay, setMealsByDay] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);
  const [checkedMeals, setCheckedMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [dailyCalories, setDailyCalories] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user_active_plan");
      if (raw) {
        const plan = JSON.parse(raw);
        setMealsByDay(normaliseMeals(plan.meals));
        setDailyCalories(plan.dailyCalories ?? null);
        // restore checked state
        const saved = localStorage.getItem("meal_checked");
        if (saved) setCheckedMeals(JSON.parse(saved));
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  const days = Object.keys(mealsByDay).map(Number).sort((a, b) => a - b);
  const todayMeals = (mealsByDay[selectedDay] || []).slice().sort(
    (a, b) => MEAL_ORDER.indexOf(a.mealTime) - MEAL_ORDER.indexOf(b.mealTime)
  );

  const toggleCheck = (mealId) => {
    setCheckedMeals((prev) => {
      const next = { ...prev, [mealId]: !prev[mealId] };
      localStorage.setItem("meal_checked", JSON.stringify(next));
      return next;
    });
  };

  const checkedToday = todayMeals.filter((m) => checkedMeals[m.mealId]).length;
  const progress = todayMeals.length > 0 ? Math.round((checkedToday / todayMeals.length) * 100) : 0;

  const totalCalToday = todayMeals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const totalProtein  = todayMeals.reduce((s, m) => s + (m.protein  ?? 0), 0);
  const totalCarbs    = todayMeals.reduce((s, m) => s + (m.carbs    ?? 0), 0);
  const totalFats     = todayMeals.reduce((s, m) => s + (m.fats     ?? 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  );

  if (days.length === 0) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <Utensils size={40} className="text-gray-300" />
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No meal plan yet</p>
      <button
        onClick={() => navigate("/home")}
        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wide"
      >
        Generate Plan
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 select-none">
      <div className="max-w-xl mx-auto p-4 md:p-8 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => navigate("/home")}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          {/* Progress circle */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="23" stroke="#f3f4f6" strokeWidth="5" fill="none" />
              <circle
                cx="28" cy="28" r="23"
                stroke="#10b981" strokeWidth="5" fill="none"
                strokeDasharray={144.5}
                strokeDashoffset={144.5 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-gray-800">{progress}%</span>
          </div>

          <h2 className="text-sm font-black tracking-tight flex items-center gap-2 uppercase">
            <Utensils className="text-green-600" size={16} /> Meal Plan
          </h2>
        </div>

        {/* ── Macros summary bar ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Calories</p>
            <p className="text-sm font-black text-gray-800 font-mono mt-0.5">
              {Math.round(totalCalToday)}
              <span className="text-[9px] font-bold text-gray-400"> kcal</span>
            </p>
            {dailyCalories && (
              <p className="text-[9px] text-gray-400 font-bold">/ {Math.round(dailyCalories)}</p>
            )}
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Protein</p>
            <p className="text-sm font-black text-blue-600 font-mono mt-0.5">{totalProtein}<span className="text-[9px] font-bold text-gray-400">g</span></p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Carbs</p>
            <p className="text-sm font-black text-amber-500 font-mono mt-0.5">{totalCarbs}<span className="text-[9px] font-bold text-gray-400">g</span></p>
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Fats</p>
            <p className="text-sm font-black text-orange-500 font-mono mt-0.5">{totalFats}<span className="text-[9px] font-bold text-gray-400">g</span></p>
          </div>
        </div>

        {/* ── Day tabs ── */}
        {days.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`shrink-0 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide transition-all ${
                  selectedDay === d
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-100"
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        )}

        {/* ── Meal cards ── */}
        <div className="space-y-3">
          {todayMeals.map((meal) => {
            const done = !!checkedMeals[meal.mealId];
            return (
              <div
                key={meal.mealId}
                className={`rounded-[24px] border-2 bg-white shadow-sm overflow-hidden transition-all duration-300 ${
                  done ? "border-green-200 bg-green-50/30" : "border-gray-100"
                }`}
              >
                <div className="p-5 flex justify-between items-start gap-3">
                  <div className="flex-1 space-y-1.5 min-w-0">
                    {/* meal time badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{MEAL_EMOJI[meal.mealTime] ?? "🍽️"}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {meal.mealTime}
                      </span>
                    </div>

                    {/* meal name */}
                    <h3 className={`text-sm font-black leading-tight ${done ? "text-green-700 line-through" : "text-gray-800"}`}>
                      {meal.name}
                    </h3>

                    {/* ingredients hint */}
                    {meal.ingredients && (
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-2">
                        🥄 {meal.ingredients}
                      </p>
                    )}

                    {/* macros row */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                        <Flame size={10} /> {meal.calories} kcal
                      </span>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">
                        💪 {meal.protein}g P
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg">
                        <Zap size={9} className="inline" /> {meal.carbs}g C
                      </span>
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-lg">
                        <Droplets size={9} className="inline" /> {meal.fats}g F
                      </span>
                    </div>
                  </div>

                  {/* check toggle */}
                  <button
                    onClick={() => toggleCheck(meal.mealId)}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                      done
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-200 text-transparent hover:border-green-400"
                    }`}
                  >
                    <svg viewBox="0 0 12 10" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="1 5 4.5 9 11 1" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
