"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ================= TYPES ================= */

interface ExplanationBlock {
  heatmap?: string;
  reason?: string;
}

interface BackendResponse {
  emotion: string;
  confidence: number;
  heatmap: string;
  primary_explanation: {
    method: string;
    reason: string;
  };
  extra_explanations: Record<string, ExplanationBlock>;
}

/* ================= SKELETON ================= */

const Skeleton = () => (
  <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
    <div className="h-[360px] rounded-3xl bg-slate-200 dark:bg-white/10" />
    <div className="space-y-6">
      <div className="h-10 w-1/2 bg-slate-200 dark:bg-white/10 rounded-lg" />
      <div className="h-6 w-1/3 bg-slate-200 dark:bg-white/10 rounded-lg" />
      <div className="h-64 bg-slate-200 dark:bg-white/10 rounded-2xl" />
      <div className="h-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
    </div>
  </div>
);

/* ================= PAGE ================= */

export default function ResultPage() {
  const [data, setData] = useState<BackendResponse | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const storedData = sessionStorage.getItem("emotionResult");
    const storedImage = sessionStorage.getItem("emotionImage");

    if (storedData && storedImage) {
      setData(JSON.parse(storedData));
      setImage(storedImage);
    }

    const timer = setTimeout(() => setLoading(false), 900); // smooth load
    return () => clearTimeout(timer);
  }, []);

  /* ================= PDF DOWNLOAD ================= */

  const downloadPDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("AutiSense_Emotion_Report.pdf");
  };

  /* ================= EMPTY STATE ================= */

  if (!loading && (!data || !image)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        No result found.
      </div>
    );
  }

  return (
    <section className="pt-28 pb-24 px-6 max-w-7xl mx-auto">
      <AnimatePresence>
        {loading ? (
          <Skeleton />
        ) : (
          <motion.div
            ref={pdfRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="
              grid grid-cols-1 md:grid-cols-2 gap-10
              bg-white/70 dark:bg-white/5
              backdrop-blur-2xl
              border border-slate-200 dark:border-white/20
              rounded-3xl p-10 shadow-2xl
            "
          >
            {/* LEFT — IMAGE */}
            <div className="flex justify-center">
              <Image
                src={image!}
                alt="User image"
                width={360}
                height={360}
                className="rounded-2xl object-cover shadow-lg"
              />
            </div>

            {/* RIGHT — RESULT */}
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-bold">
                {data!.emotion}
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-300">
                Confidence:{" "}
                <span className="font-semibold">
                  {(data!.confidence * 100).toFixed(2)}%
                </span>
              </p>

              {/* PRIMARY HEATMAP */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/20">
                <img src={data!.heatmap} alt="Grad-CAM Heatmap" />
              </div>

              {/* REASON */}
              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                <strong>Why?</strong> {data!.primary_explanation.reason}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowMore((p) => !p)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#001f65] to-[#6895FD] text-white shadow-lg"
                >
                  {showMore ? "Hide Full Details" : "Show Full Details"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={downloadPDF}
                  className="px-6 py-2 rounded-full border border-slate-300 dark:border-white/30 backdrop-blur-lg"
                >
                  Download PDF
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push("/emotion")}
                  className="px-6 py-2 rounded-full border border-slate-300 dark:border-white/30 backdrop-blur-lg"
                >
                  Try Another Image
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXTRA DETAILS */}
      <AnimatePresence>
        {showMore && data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 space-y-8"
          >
            {Object.entries(data.extra_explanations).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="
                    bg-white/60 dark:bg-white/5
                    backdrop-blur-xl
                    border border-slate-200 dark:border-white/20
                    rounded-3xl p-8 shadow-xl
                  "
                >
                  <h3 className="text-2xl font-semibold capitalize mb-4">
                    {key.replace("_", " ")}
                  </h3>

                  {value.heatmap && (
                    <img
                      src={value.heatmap}
                      className="rounded-xl mb-4"
                    />
                  )}

                  {value.reason && (
                    <p className="text-slate-700 dark:text-slate-300">
                      {value.reason}
                    </p>
                  )}
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
