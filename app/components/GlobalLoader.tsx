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
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-[90%]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              <motion.div
                className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"
              />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-[#6895FD] rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 bg-gradient-to-tr from-[#001f65] to-[#6895FD] rounded-full opacity-20 blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>
            <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg text-center tracking-tight">
              {message}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}