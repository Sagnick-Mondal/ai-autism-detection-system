"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  isOpen: boolean;
  message?: string;
}

export default function GlobalLoader({
  isOpen,
  message = "Analyzing image...",
}: LoaderProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white/70 dark:bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-xl flex flex-col items-center gap-6">
              <motion.div
                className="w-12 h-12 border-4 border-t-emerald-400 border-slate-300 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                {message}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}