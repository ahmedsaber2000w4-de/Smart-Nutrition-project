
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    // ── Persist plan so MainPage can always read it ───────────────────────────
    if (state?.plan) {
      localStorage.setItem("onboardingData", JSON.stringify(state));
    }

    // ── Countdown ─────────────────────────────────────────────────────────────
    const tick = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/main", { replace: true });
    }, 3000);

    return () => {
      clearInterval(tick);
      clearTimeout(redirect);
    };
  }, [navigate, state]);

  // Pull a summary to show the user while they wait
  const nutrition = state?.nutrition ?? null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full"
      >
        {/* Icon */}
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Your Plan is Ready!</h1>
        <p className="text-gray-500 mb-8 font-medium">
          Taking you to your dashboard in{" "}
          <span className="text-green-600 font-bold">{timeLeft}s</span>
        </p>

        {/* Show calorie summary if available */}
        {nutrition && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100"
          >
            <p className="text-5xl font-black text-green-600 mb-1">
              {nutrition.targetCalories}
            </p>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              kcal / day
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Protein", value: `${nutrition.protein}g` },
                { label: "Carbs",   value: `${nutrition.carbs}g`   },
                { label: "Fat",     value: `${nutrition.fat}g`     },
              ].map((m) => (
                <div key={m.label} className="bg-white rounded-2xl p-3 border border-gray-100">
                  <p className="text-lg font-black text-gray-800">{m.value}</p>
                  <p className="text-xs font-bold text-gray-400">{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}  

        {/* Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-100 rounded-full" />
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute" />
        </div>
      </motion.div>
    </div>
  );
}

