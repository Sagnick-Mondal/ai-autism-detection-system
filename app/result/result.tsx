/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface XAIMaps {
  gradcam: string;
  gradcampp: string;
  saliency: string;
  smoothgrad: string;
}

interface ResultData {
  emotion: string;
  confidence: number;
  heatmap: string;
  best_method: string;
  xai: XAIMaps;
}

export default function Result() {
  const router = useRouter();

  const [result, setResult] = useState<ResultData | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"best" | "comparison">("best");
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

  const xaiEntries = Object.entries(result.xai);

  return (
    <section className="min-h-screen pt-28 px-6 flex justify-center">
      <div className="max-w-7xl w-full bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-3xl shadow-xl p-10">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

          <div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white">
              {result.emotion}
            </h2>

            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              {result.confidence.toFixed(2)}% confidence
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setViewMode("best")}
              className={`px-5 py-2 rounded-full font-medium transition ${
                viewMode === "best"
                  ? "bg-[#001f65] text-white"
                  : "bg-slate-200 dark:bg-white/10"
              }`}
            >
              Best Result
            </button>

            <button
              onClick={() => setViewMode("comparison")}
              className={`px-5 py-2 rounded-full font-medium transition ${
                viewMode === "comparison"
                  ? "bg-[#001f65] text-white"
                  : "bg-slate-200 dark:bg-white/10"
              }`}
            >
              Full Comparison
            </button>
          </div>
        </div>

        {/* ================= BEST VIEW ================= */}
        {viewMode === "best" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Image + Toggle */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={showHeatmap ? "heatmap" : "original"}
                  src={showHeatmap ? result.heatmap : originalImage}
                  alt="Result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              <button
                onClick={() => setShowHeatmap((prev) => !prev)}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-full
                           bg-black/70 text-white text-sm backdrop-blur-md"
              >
                {showHeatmap ? "Show Original" : "Show Heatmap"}
              </button>
            </div>

            {/* Explanation */}
            <div className="flex flex-col justify-center">
              <div className="p-6 bg-slate-100 dark:bg-white/10 rounded-2xl">
                <h3 className="font-semibold mb-3">Best XAI Method</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {result.best_method.toUpperCase()} provided the most stable
                  explanation for this prediction by highlighting the strongest
                  contributing facial regions.
                </p>
              </div>

              <button
                onClick={() => router.push("/detection")}
                className="mt-8 px-6 py-3 rounded-full
                           bg-gradient-to-br from-[#001f65] to-[#6895FD]
                           text-white font-semibold shadow-lg"
              >
                Try Another Image
              </button>
            </div>
          </div>
        )}

        {/* ================= FULL COMPARISON ================= */}
        {viewMode === "comparison" && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {xaiEntries.map(([method, image]) => (
              <motion.div
                key={method}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-md"
              >
                <h3 className="text-center font-semibold mb-3 capitalize">
                  {method}
                </h3>

                <img
                  src={image}
                  alt={method}
                  className="rounded-xl w-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}