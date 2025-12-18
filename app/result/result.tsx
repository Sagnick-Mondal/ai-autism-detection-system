/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ResultData {
  emotion: string;
  confidence: number;
  heatmap: string;
}

const XAI_EXPLANATIONS: Record<string, string> = {
  Happy:
    "The model focused strongly on the mouth and cheek regions. Upward curvature of the lips and activated cheek muscles are strong indicators of happiness, which explains the high confidence.",
  Sad:
    "Attention was concentrated around the eyes and mouth corners. Drooping facial features and reduced muscle activation are commonly associated with sadness.",
  Angry:
    "The heatmap highlights the eyebrow and eye regions, indicating facial tension. Furrowed brows and intense eye focus are key indicators of anger.",
  Fear:
    "The model emphasized the eye and mouth regions. Wide eyes and partially open mouth suggest heightened alertness, which is characteristic of fear.",
  Surprise:
    "Strong activation is visible around the eyes and mouth. Raised eyebrows and an open mouth are classic facial expressions of surprise.",
  Disgust:
    "The model focused on the nose and upper lip area. Facial movements in this region are commonly linked with expressions of disgust.",
};

export default function Result() {
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("emotionResult");
    const storedImage = sessionStorage.getItem("emotionImage");

    if (!storedResult || !storedImage) {
      router.push("/");
      return;
    }

    setResult(JSON.parse(storedResult));
    setOriginalImage(storedImage);
  }, [router]);

  if (!result || !originalImage) return null;

  return (
    <section className="min-h-screen pt-28 px-6 flex justify-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-3xl shadow-xl p-10">

        {/* IMAGE / HEATMAP WITH SMOOTH TOGGLE */}
        <div className="relative rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={showHeatmap ? "heatmap" : "original"}
              src={showHeatmap ? result.heatmap : originalImage}
              alt={showHeatmap ? "Model attention heatmap" : "Uploaded image"}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full h-full object-cover absolute inset-0"
            />
          </AnimatePresence>

          <button
            onClick={() => setShowHeatmap((prev) => !prev)}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-full
                       bg-black/70 text-white text-sm font-medium
                       backdrop-blur-md hover:bg-black/90 transition"
          >
            {showHeatmap ? "Show Original" : "Show Heatmap"}
          </button>
        </div>

        {/* RESULT + XAI EXPLANATION */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
            {result.emotion}
          </h2>

          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            {result.confidence.toFixed(2)}% confidence
          </p>

          {/* XAI EXPLANATION */}
          <div className="mt-6 p-5 bg-slate-100 dark:bg-white/10 rounded-2xl">
            <h3 className="font-semibold mb-2">Why did the model predict this?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {XAI_EXPLANATIONS[result.emotion]}
            </p>
          </div>

          {/* DISCLAIMER */}
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            The highlighted regions indicate areas that most influenced the model’s decision.
            Higher confidence does not imply certainty and predictions may vary with image quality.
          </p>

          <button
            onClick={() => router.push("/detection")}
            className="mt-8 px-6 py-3 rounded-full
                       bg-gradient-to-br from-[#001f65] to-[#6895FD]
                       text-white font-semibold shadow-lg"
          >
            Try Another Image
          </button>
        </motion.div>
      </div>
    </section>
  );
}
