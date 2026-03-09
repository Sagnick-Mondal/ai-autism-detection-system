/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useEmotionStore } from "../store/emotionStore";

const EMOTION_COLORS: Record<string, string> = {
  Anger: "#FF4C4C",
  Fear: "#FF9F1C",
  Happiness: "#FFD93D",
  Sadness: "#4D96FF",
  Surprise: "#9D4EDD",
  Neutral: "#6C757D",
};

function getEmotionColor(name: string) {
  const formatted =
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return EMOTION_COLORS[formatted] || "#8884d8";
}

export default function Result() {
  const router = useRouter();
  const { emotionResult } = useEmotionStore();
  const [viewMode, setViewMode] = useState<"best" | "comparison">("best");

  useEffect(() => {
    if (!emotionResult) {
      router.push("/detection");
      return;
    }
  }, [router, emotionResult]);

  if (!emotionResult) return null;

  const result = emotionResult;

  /* =============================
     CONFIDENCE CALCULATION
  ============================= */

  const confidence =
    result.probabilities[result.emotion] ??
    result.probabilities[result.emotion.toLowerCase()] ??
    result.probabilities[
      result.emotion.charAt(0).toUpperCase() +
        result.emotion.slice(1).toLowerCase()
    ] ??
    0;

  const confidencePercent = confidence.toFixed(1);

  const pieData = Object.entries(result.probabilities).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const barData = Object.entries(result.xai_scores).map(
    ([method, score]) => ({
      method,
      score,
    })
  );

  return (
    <section className="min-h-screen pt-28 px-6 flex justify-center">
      <div className="max-w-7xl w-full backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          {/* EMOTION + CONFIDENCE */}
          <h1 className="text-4xl font-bold text-left flex items-center gap-4">
            {result.emotion}
            <span className="px-4 py-1 rounded-full bg-white/20 text-lg font-semibold">
              {confidencePercent}%
            </span>
          </h1>

          {/* TOGGLE */}
          <div className="flex gap-3">
            {(["best", "comparison"] as const).map((mode) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  viewMode === mode
                    ? "bg-gradient-to-br from-[#001f65] to-[#6895FD] text-white shadow-lg"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {mode === "best" ? "Best Result" : "Full Comparison"}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ================= BEST RESULT ================= */}
        {viewMode === "best" && (
          <div className="grid md:grid-cols-2 gap-12">

            <div className="glass-card p-6 rounded-2xl flex flex-col">
              <img
                src={result.xai[result.best_method]}
                alt={`${result.best_method} XAI visualization showing attention regions for ${result.emotion} emotion detection`}
                className="rounded-xl mb-6 w-full h-auto object-cover"
              />

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={70}>
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={getEmotionColor(entry.name)}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-6 text-sm text-white/80">
                The pie chart represents probability distribution across
                emotional classes predicted by the neural network. Higher
                percentages indicate stronger model confidence in that emotion.
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-4">
                Why {result.best_method.toUpperCase()} was chosen?
              </h3>

              <p className="text-sm text-white/80">
                This XAI method produced the most concentrated and stable
                attention region across facial features. The bar chart below
                compares overall activation consistency across methods.
              </p>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="green" />
                </BarChart>
              </ResponsiveContainer>

              <button
                onClick={() => router.push("/detection")}
                className="mt-10 w-full px-6 py-3 rounded-full bg-gradient-to-br from-[#001f65] to-[#6895FD] text-white font-semibold shadow-lg"
              >
                Try Another Image
              </button>
            </div>
          </div>
        )}

        {/* ================= FULL COMPARISON ================= */}
        {viewMode === "comparison" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(result.xai).map(([method, img]) => (
                <motion.div
                  key={method}
                  className="glass-card p-5 rounded-2xl"
                >
                  <h3 className="text-center font-bold mb-3 capitalize">
                    {method}
                  </h3>

                  <img src={img} alt={`${method} XAI visualization for ${result.emotion} emotion detection`} className="rounded-xl mb-4" />

                  <div className="text-center font-semibold mb-2">
                    {result.emotion} ({confidencePercent}%)
                  </div>

                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" outerRadius={60}>
                        {pieData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={getEmotionColor(entry.name)}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="text-xs text-white/70 mt-3">
                    Emotion probabilities based on softmax output layer.
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Comparison Chart */}
            <div className="mt-16 glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold mb-6 text-center">
                XAI Method Comparison
              </h3>

              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={barData}>
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="blue" />
                </BarChart>
              </ResponsiveContainer>

              <button
                onClick={() => router.push("/detection")}
                className="mt-10 w-full px-6 py-3 rounded-full bg-gradient-to-br from-[#001f65] to-[#6895FD] text-white font-semibold shadow-lg"
              >
                Try Another Image
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}