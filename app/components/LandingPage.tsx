/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Smile } from "lucide-react";
import AutismCarousel from "./AutismCarousel";
import ModelWorkflowCarousel from "./ModelWorkfliwCarousel";
import { useAuthModal } from "./useAuthModal";
import MissionVisionPage from "./Mission";

export default function LandingPage() {
  const features = [
    {
      title: "AI-Powered Accuracy",
      desc: "State-of-the-art AI models detect subtle facial emotions with high precision.",
      icon: (
        <Activity
          size={32}
          className="text-indigo-600 dark:text-purple-400 mb-3"
        />
      ),
    },
    {
      title: "Safe & Secure",
      desc: "Your data is private and securely handled, ensuring complete safety.",
      icon: (
        <ShieldCheck
          size={32}
          className="text-indigo-600 dark:text-purple-400 mb-3"
        />
      ),
    },
    {
      title: "Easy to Use",
      desc: "Intuitive interface for parents, caregivers, and professionals alike.",
      icon: (
        <Smile
          size={32}
          className="text-indigo-600 dark:text-purple-400 mb-3"
        />
      ),
    },
  ];

  const { open } = useAuthModal();


  return (
    <main className="pt-20 min-h-screen flex flex-col justify-center items-center text-center px-6">
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-full"
      >
        <h1 className="text-9xl md:text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tl from-[#001f65] via-sky-400 to-[#6895FD]">
          Emotion Detection <br />
          for
          <br /> Autistic Children
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300">
          Understanding emotions through AI-powered insights. Make a difference,
          one smile at a time.
        </p>

        {/* ================= BUTTONS ================= */}
        <motion.div
          className="mt-8 flex flex-col md:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {/* PRIMARY BUTTON – ORIGINAL */}
          <button
            type="button"
            onClick={() => open("signup")}
            className="
    px-8 py-3 rounded-full
    bg-gradient-to-br from-[#001f65] to-[#6895FD]
    text-white font-semibold
    shadow-lg hover:scale-105 hover:shadow-2xl
    transition-transform duration-300
    flex items-center gap-2 justify-center
  "
          >
            <Activity size={20} /> Get Started
          </button>

          {/* SECONDARY BUTTON – RESTORED */}
          <a
            href="https://github.com/Sagnick-Mondal/ai-autism-detection-system/tree/Main"
            className="
              px-8 py-3 rounded-full
              border border-slate-400 dark:border-white/30
              text-slate-800 dark:text-white font-semibold
              shadow-lg
              hover:bg-slate-200/60 dark:hover:bg-white/10 hover:scale-105
              transition-all duration-300
              flex items-center gap-2 justify-center
            "
          >
            <ShieldCheck size={20} /> Documentation
          </a>
        </motion.div>
      </motion.div>

      {/* ================= FEATURES ================= */}
      <motion.div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {features.map((f, i) => (
          <motion.div
            key={i}
            className="
              p-6
              bg-white/70 dark:bg-white/10
              backdrop-blur-md
              border border-slate-200 dark:border-white/20
              rounded-2xl shadow-lg
              hover:scale-105 transition-transform duration-300
              flex flex-col items-center
            "
          >
            {f.icon}
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {f.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <MissionVisionPage />
      {/* ================= FOOTER CTA ================= */}
      <div className="mt-10">
        <p className="text-slate-700 dark:text-slate-200 mb-4 text-6xl font-extrabold">
          Ready to explore?
        </p>
        <AutismCarousel />
      </div>
      <div className="mt-32">
        <p className="text-slate-700 dark:text-slate-200 mb-4 text-6xl font-semibold">
          Functional Workflow
        </p>
        <ModelWorkflowCarousel />
      </div>
    </main>
  );
}
