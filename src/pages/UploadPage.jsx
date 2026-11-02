import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle2, Brain, Play, UploadCloud, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Exercise catalogue ────────────────────────────────────────────
const EXERCISES = [
  {
    id: "push_ups",
    name: "Push Ups",
    muscle: "Chest · Triceps",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXo4bHc3bXZzNGZudWcwZjF4dThqeHl4bXd3YnFhY3hmZTZwdnRhZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lMt7tFdRvYnHDDxjSz/giphy.gif",
    cues: ["Keep core tight", "Elbows at 45°", "Full range of motion"],
  },
  {
    id: "pull_ups",
    name: "Pull Ups",
    muscle: "Back · Biceps",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2UzZXQwMW41cTY2dWkwcXN3NTd4bGM5MzhieDQ5aXdkemFveW5pYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UxNTT9E0ypVAiKwMaY/giphy.gif",
    cues: ["Dead hang start", "Drive elbows down", "Chin over bar"],
  },
  {
    id: "squats",
    name: "Squats",
    muscle: "Quads · Glutes",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXMzb2FiNDVta3JzbjBrdm1iaTBkMmJ0cWRheTBkcjV4d3I3NHM3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HEoB4jBxATXt6/giphy.gif",
    cues: ["Chest upright", "Knees track toes", "Break parallel"],
  },
  {
    id: "jumping_jacks",
    name: "Jumping Jacks",
    muscle: "Full Body · Cardio",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnV0eGxnYnhlZ2k3dmF4ZzZ4cHVqeWw0bmw2NXZ5ZHZ6b3Vic2h3cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlPystfePnAI3G8/giphy.gif",
    cues: ["Arms fully extend", "Soft landing", "Steady rhythm"],
  },
  {
    id: "lunges",
    name: "Lunges",
    muscle: "Legs · Glutes",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXV2enprMm9mdzBybXhhejA5dGZuMW9xNjFid2U2OHlkN3JnbjNpeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPavRPgJYaNI97O/giphy.gif",
    cues: ["90° knee angle", "Front knee over ankle", "Core engaged"],
  },
  {
    id: "plank",
    name: "Plank",
    muscle: "Core · Shoulders",
    gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHgzNWxzMHBrenhoMGZiOXF5YzI0ZWhyNm02dmt2cGRtMGJ4ZGh4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hpX5WImImOzlS/giphy.gif",
    cues: ["Neutral spine", "Don't sag hips", "Breathe steadily"],
  },
];

// ── Claude API call ───────────────────────────────────────────────
async function analyzeWithClaude(base64Image, exerciseName) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/jpeg", data: base64Image },
            },
            {
              type: "text",
              text: `You are an expert fitness coach analyzing exercise form. The user is performing: ${exerciseName}.

Analyze the body posture and form visible in this image. Respond ONLY with a JSON object (no markdown, no backticks) in this exact structure:
{
  "score": <number 0-100>,
  "grade": "<A+|A|B+|B|C|D>",
  "summary": "<one encouraging sentence about overall form>",
  "positives": ["<what they're doing well 1>", "<what they're doing well 2>"],
  "corrections": ["<specific correction 1>", "<specific correction 2>"],
  "tip": "<one key coaching tip to improve>"
}`,
            },
          ],
        },
      ],
    }),
  });
  const data = await response.json();
  const text = data.content?.map((c) => c.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── ScoreRing ─────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-36 h-36 flex items-center justify-center mx-auto">
      <svg width="144" height="144" className="-rotate-90" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} stroke="#f3f4f6" strokeWidth="10" fill="none" />
        <motion.circle
          cx="72" cy="72" r={r}
          stroke={color} strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-gray-900">{score}</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────
export default function UploadPage() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  // screens: "intro" | "select" | "analyse" | "result"
  const [screen,   setScreen]   = useState("intro");
  const [selected, setSelected] = useState(null);   // exercise id
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);

  const selectedEx = EXERCISES.find((e) => e.id === selected);

  // ── handle file pick ──
  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // ── run analysis ──
  const runAnalysis = async () => {
    if (!file || !selected) return;
    setLoading(true);
    setError(null);
    setScreen("analyse");
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();

        if (file.type.startsWith("image/")) {
          reader.onload = () => res(reader.result.split(",")[1]);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        } else {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(file);
          video.crossOrigin = "anonymous";
          video.onloadeddata = () => {
            video.currentTime = 0.5;
          };
          video.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width  = video.videoWidth  || 640;
            canvas.height = video.videoHeight || 480;
            canvas.getContext("2d").drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
              const r2 = new FileReader();
              r2.onload = () => res(r2.result.split(",")[1]);
              r2.onerror = rej;
              r2.readAsDataURL(blob);
            }, "image/jpeg", 0.85);
          };
          video.onerror = rej;
        }
      });

      const analysis = await analyzeWithClaude(base64, selectedEx.name);
      setResult(analysis);
      setScreen("result");
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try a clear photo or video of your exercise.");
      setScreen("analyse");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setScreen("intro");
    setSelected(null);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  // ════════════════════════════════════════════════════════════════
  // SCREEN: INTRO
  // ════════════════════════════════════════════════════════════════
  if (screen === "intro") return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center gap-6 max-w-xs"
      >
        {/* icon */}
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-200">
          <Brain size={44} className="text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">AI Form Feedback</h1>
          <p className="text-gray-500 font-medium text-sm leading-relaxed">
            Analyze your body pose positioning with live metrics tracking feedback.
          </p>
        </div>

        <button
          onClick={() => setScreen("select")}
          className="flex items-center gap-3 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-green-200 text-sm"
        >
          Select exercise video
          <ChevronRight size={18} />
        </button>
      </motion.div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // SCREEN: SELECT EXERCISE
  // ════════════════════════════════════════════════════════════════
  if (screen === "select") return (
    <div className="min-h-screen bg-[#F0F2F5] pb-28">
      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* header */}
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <button onClick={() => setScreen("intro")} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-tight text-gray-800">AI Trainer — Select Exercise</h2>
        </div>

        {/* GIF preview */}
        <AnimatePresence mode="wait">
          {selectedEx ? (
            <motion.div
              key={selectedEx.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
            >
              <img
                src={selectedEx.gif}
                alt={selectedEx.name}
                className="w-full h-52 object-contain bg-gray-50 p-4"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="p-4 border-t border-gray-50 flex gap-2 flex-wrap">
                {selectedEx.cues.map((c) => (
                  <span key={c} className="text-[10px] font-black bg-green-50 text-green-700 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-[28px] border border-gray-100 shadow-sm h-52 flex items-center justify-center"
            >
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Select an exercise below</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* exercise list */}
        <div className="space-y-2.5">
          {EXERCISES.map((ex) => {
            const isSelected = selected === ex.id;
            return (
              <motion.button
                key={ex.id}
                onClick={() => setSelected(ex.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex justify-between items-center px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-green-500 bg-green-50"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div>
                  <p className={`text-sm font-black ${isSelected ? "text-green-700" : "text-gray-800"}`}>{ex.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{ex.muscle}</p>
                </div>
                {isSelected
                  ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                  : <ChevronRight size={18} className="text-gray-300 shrink-0" />
                }
              </motion.button>
            );
          })}
        </div>

        {/* upload + start */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 pt-2"
          >
            {/* file picker */}
            <label className="block cursor-pointer">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFile}
              />
              <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all ${
                file ? "border-green-400 bg-green-50" : "border-dashed border-gray-300 bg-white hover:border-gray-400"
              }`}>
                <UploadCloud size={20} className={file ? "text-green-500" : "text-gray-400"} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black ${file ? "text-green-700" : "text-gray-600"}`}>
                    {file ? file.name : "Upload your photo or video"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">JPG, PNG, MP4 supported</p>
                </div>
                {preview && file?.type.startsWith("image/") && (
                  <img src={preview} className="w-12 h-12 rounded-xl object-cover border border-green-200" alt="preview" />
                )}
              </div>
            </label>

            {/* start button */}
            <button
              onClick={runAnalysis}
              disabled={!file}
              className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wide transition-all ${
                file
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {file ? "Start Exercise Analysis" : "Upload a file first"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // SCREEN: ANALYSING
  // ════════════════════════════════════════════════════════════════
  if (screen === "analyse") return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center px-6 gap-8">
      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[28px] border border-red-100 p-8 max-w-sm w-full text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <p className="text-sm font-black text-gray-800">Analysis Failed</p>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">{error}</p>
          <button
            onClick={() => { setScreen("select"); setError(null); }}
            className="flex items-center gap-2 mx-auto px-6 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs"
          >
            <RotateCcw size={14} /> Try Again
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-blue-200">
            <Loader2 size={36} className="text-white animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-black text-gray-800">Analyzing your form…</p>
            <p className="text-xs text-gray-400 font-medium">AI is reviewing your {selectedEx?.name} technique</p>
          </div>
          {/* animated dots */}
          <div className="flex gap-2">
            {[0, 0.2, 0.4].map((d, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, delay: d, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // SCREEN: RESULT
  // ════════════════════════════════════════════════════════════════
  if (screen === "result" && result) return (
    <div className="min-h-screen bg-[#F0F2F5] pb-28">
      <div className="max-w-lg mx-auto p-4 space-y-4">

        {/* header */}
        <div className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <button onClick={reset} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <h2 className="text-sm font-black uppercase tracking-tight text-gray-800">
            {selectedEx?.name} — Form Report
          </h2>
        </div>

        {/* score card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 space-y-4"
        >
          <ScoreRing score={result.score} />
          <div className="text-center">
            <span className="text-4xl font-black text-gray-900">{result.grade}</span>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
              {result.summary}
            </p>
          </div>
        </motion.div>

        {/* positives */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 space-y-3"
        >
          <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">✅ What You're Doing Well</p>
          <div className="space-y-2">
            {(result.positives || []).map((p, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-green-50 rounded-2xl p-3.5">
                <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-green-800 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* corrections */}
        {(result.corrections || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-5 space-y-3"
          >
            <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">⚠️ Form Corrections</p>
            <div className="space-y-2">
              {result.corrections.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-amber-50 rounded-2xl p-3.5">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-800 leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* tip */}
        {result.tip && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[28px] p-5 space-y-2 shadow-lg shadow-blue-200"
          >
            <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest">🧠 Coach's Key Tip</p>
            <p className="text-sm font-black text-white leading-relaxed">{result.tip}</p>
          </motion.div>
        )}

        {/* uploaded image preview */}
        {preview && file?.type.startsWith("image/") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden"
          >
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest p-4 pb-0">Your Photo</p>
            <img src={preview} alt="uploaded" className="w-full max-h-64 object-contain p-4" />
          </motion.div>
        )}

        {/* redo button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={reset}
          className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} /> Analyze Another Exercise
        </motion.button>
      </div>
    </div>
  );

  return null;
}
