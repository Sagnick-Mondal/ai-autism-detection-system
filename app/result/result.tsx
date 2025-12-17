/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ResultData {
  emotion: string;
  confidence: number;
  heatmap: string;
  reason: string;
}

export default function Result() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const storedImage = sessionStorage.getItem("emotionImage");
    const storedResult = sessionStorage.getItem("emotionResult");

    if (!storedImage || !storedResult) {
      router.push("/");
      return;
    }

    setImage(storedImage);
    setResult(JSON.parse(storedResult));
  }, [router]);

  if (!image || !result) return null;

  return (
    <section className="min-h-screen pt-28 px-6 flex justify-center">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/20 rounded-3xl shadow-xl p-10">
        {/* IMAGE */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src={image} className="w-full h-full object-cover" />
          <img
            src={`data:image/png;base64,${result.heatmap}`}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        </div>

        {/* RESULT */}
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

          <div className="mt-6 p-5 bg-slate-100 dark:bg-white/10 rounded-2xl">
            <h3 className="font-semibold mb-2">Why this emotion?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {result.reason}
            </p>
          </div>

          <button
            onClick={() => router.push("/detection")}
            className="mt-8 px-6 py-3 rounded-full bg-gradient-to-br from-[#001f65] to-[#6895FD] text-white font-semibold shadow-lg"
          >
            Try Another Image
          </button>
        </motion.div>
      </div>
    </section>
  );
}
