import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Dumbbell, Flame, CheckCircle2, Play, Pause, ChevronLeft, Trophy, Zap, Youtube, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PLAN_API = "https://gp-backend-production-7b9a.up.railway.app/api";
const getToken = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// ─── ExerciseCard ─────────────────────────────────────────────
const ExerciseCard = ({ title, sets, reps, targetMinutes, intensity, onFinish, isInitiallyDone }) => {
  const totalSecs = (targetMinutes || 5) * 60;
  const [seconds,    setSeconds]    = useState(totalSecs);
  const [isActive,   setIsActive]   = useState(false);
  const [isDone,     setIsDone]     = useState(isInitiallyDone);
  const [showHint,   setShowHint]   = useState(false);

  // YouTube search URL — opens YouTube search for the exercise tutorial
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " exercise tutorial how to")}`;

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((p) => p - 1), 1000);
    } else if (seconds === 0 && !isDone) {
      setIsActive(false);
      setIsDone(true);
      onFinish(title);
      toast.success(`✅ ${title} done!`);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, isDone, title, onFinish]);

  const formatTime = (s) => {
    const m   = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progress = 1 - seconds / totalSecs;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[22px] border overflow-hidden transition-all ${
        isDone ? "bg-green-50 border-green-200" : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      {/* ── main row ── */}
      <div className="p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isDone && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
              <h3 className={`text-sm font-black ${isDone ? "text-green-700 line-through" : "text-gray-800"}`}>
                {title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg font-mono">
                {sets} × {reps}
              </span>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Clock size={11} /> {targetMinutes} min
              </span>
              {intensity && (
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg">
                  Intensity {intensity}/10
                </span>
              )}
            </div>
            {!isDone && progress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
            <span className="text-sm font-black font-mono bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-gray-700">
              {formatTime(seconds)}
            </span>
            {/* video hint toggle */}
            <button
              onClick={() => setShowHint((p) => !p)}
              title="How to do this exercise"
              className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all flex items-center gap-1"
            >
              <Youtube size={16} />
              {showHint
                ? <ChevronUp size={13} />
                : <ChevronDown size={13} />}
            </button>
            {/* play/done button */}
            <button
              onClick={() => {
                if (isDone) {
                  setIsDone(false);
                  setSeconds(totalSecs);
                } else {
                  setIsActive(!isActive);
                }
              }}
              className={`p-3 rounded-xl transition-all ${
                isDone
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : isActive
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {isDone ? "↺" : isActive ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── YouTube hint panel ── */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-5 rounded-2xl bg-gray-50 border border-gray-100 p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Youtube size={15} className="text-red-500 shrink-0" />
                <p className="text-xs font-black text-gray-600">
                  Not sure how to do <span className="text-gray-900">{title}</span>?
                </p>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                Watch a quick tutorial on YouTube to learn the correct form and avoid injuries.
              </p>
              <a
                href={ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-wide transition-all"
              >
                <Youtube size={14} />
                Watch Tutorial on YouTube
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── WorkoutPage ──────────────────────────────────────────────
export default function WorkoutPage() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedList, setCompletedList] = useState([]);
  const [planMeta, setPlanMeta] = useState({ location: null, caloriesBurn: null });

  // normalise: handles both array and { "1": [...] } object shapes
  const normaliseExercises = (raw) => {
    if (!raw) return [];
    const list = Array.isArray(raw) ? raw : Object.values(raw).flat();
    return list.map((ex, idx) => ({
      id:        ex.exerciseId ?? ex.id   ?? idx,
      name:      ex.exerciseName ?? ex.name ?? ex.title ?? "Exercise",
      sets:      ex.sets ?? 4,
      reps:      ex.reps ?? "10-12",
      min:       ex.durationMinutes ?? ex.min ?? 8,
      intensity: ex.intensity ?? null,
    }));
  };

  const fetchWorkoutData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Try localStorage first (instant, no network)
    try {
      const localPlan = localStorage.getItem("user_active_plan");
      if (localPlan) {
        const parsed = JSON.parse(localPlan);
        const raw = parsed?.workouts ?? parsed?.workoutPlan?.exercises ?? parsed?.exercises ?? null;
        const list = normaliseExercises(raw);
        if (list.length > 0) {
          setExercises(list);
          setPlanMeta({
            location:     parsed?.workoutPlan?.location ?? "AI Workout Plan",
            caloriesBurn: parsed?.workoutPlan?.caloriesBurn ?? parsed?.caloriesBurn ?? null,
          });
          setLoading(false);
          return;
        }
      }
    } catch (_) {}

    // 2. Fallback: fetch from server
    try {
      const res = await axios.get(`${PLAN_API}/workout`, { headers: authHeader() });
      const data = res.data;
      const raw = data?.workouts ?? data?.workoutPlan?.exercises ?? data?.exercises ?? (Array.isArray(data) ? data : null);
      const list = normaliseExercises(raw);
      if (list.length === 0) throw new Error("No exercises found in response.");
      setExercises(list);
      setPlanMeta({
        location:     data?.workoutPlan?.location ?? data?.location ?? null,
        caloriesBurn: data?.workoutPlan?.caloriesBurn ?? data?.caloriesBurn ?? null,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to load workout.";
      setError(msg);
      console.error("Workout fetch error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWorkoutData(); }, [fetchWorkoutData]);

  const handleExerciseFinish = useCallback((title) => {
    setCompletedList((prev) => {
      if (prev.includes(title)) return prev;
      const next = [...prev, title];
      // persist by exerciseId so StatusPage can count
      try {
        const plan = JSON.parse(localStorage.getItem("user_active_plan") || "{}");
        const allEx = plan.workouts ? Object.values(plan.workouts).flat() : [];
        const checked = {};
        allEx.forEach((ex) => {
          if (next.includes(ex.exerciseName ?? ex.name)) checked[ex.exerciseId ?? ex.id] = true;
        });
        localStorage.setItem("workout_checked", JSON.stringify(checked));
      } catch (_) {}
      return next;
    });
  }, []);

  const allDone  = exercises.length > 0 && completedList.length === exercises.length;
  const progress = exercises.length ? completedList.length / exercises.length : 0;

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading workout...</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-6 p-8">
        <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm text-center max-w-sm space-y-4">
          <div className="w-14 h-14 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto">
            <Dumbbell size={24} />
          </div>
          <h3 className="font-black text-gray-800 text-lg">Couldn't Load Workout</h3>
          <p className="text-sm text-gray-400">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchWorkoutData}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-wide hover:bg-gray-800 transition-all"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-black text-xs uppercase tracking-wide hover:bg-gray-200 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 select-none">
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-5">

        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={() => navigate("/home")}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="text-sm font-black tracking-widest flex items-center gap-2 uppercase text-gray-800">
            <Dumbbell className="text-green-600" size={18} />
            {planMeta.location ?? "Today's Workout"}
          </h2>
          <div className="w-10" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl text-white shadow-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</p>
            <p className="text-2xl font-black mt-1 font-mono">
              {completedList.length}
              <span className="text-gray-500 text-lg"> / {exercises.length}</span>
            </p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-[9px] text-green-400 font-bold mt-2 uppercase">Exercises Completed</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Flame size={12} className="text-orange-500" /> Est. Burn
            </p>
            <div>
              <p className="text-2xl font-black font-mono text-gray-800 mt-1">
                {planMeta.caloriesBurn ?? "—"}
                <span className="text-sm text-gray-400 font-bold"> kcal</span>
              </p>
              <p className="text-[9px] text-gray-400 uppercase font-bold mt-1">This Session</p>
            </div>
          </div>
        </div>

        {/* All done banner */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl"><Trophy size={20} /></div>
                <div>
                  <p className="font-black text-sm">Workout Complete!</p>
                  <p className="text-xs text-green-100">Every exercise is done 💪</p>
                </div>
              </div>
              <Zap size={24} className="text-yellow-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise list */}
        <div className="space-y-3">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              title={ex.name}
              sets={ex.sets}
              reps={ex.reps}
              targetMinutes={ex.min}
              intensity={ex.intensity}
              onFinish={handleExerciseFinish}
              isInitiallyDone={completedList.includes(ex.name)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
