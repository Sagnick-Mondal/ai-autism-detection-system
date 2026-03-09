"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  isOpen: boolean;
  message?: string;
}

export default function GlobalLoader({
  isOpen,
  message = "Analyzing...",
}: LoaderProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Main loader container */}
          <div className="relative flex flex-col items-center justify-center p-12">
            
            {/* Outer ambient glow */}
            <motion.div
              className="absolute w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Inner ambient glow */}
            <motion.div
              className="absolute w-32 h-32 bg-purple-500/30 rounded-full blur-2xl pointer-events-none"
              animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Premium Multi-ring Spinner */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
              {/* Outer Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-[3px] border-t-indigo-400 border-r-indigo-400/30 border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-[3px] border-b-purple-400 border-l-purple-400/30 border-t-transparent border-r-transparent"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-4 rounded-full border-[3px] border-t-sky-400 border-r-transparent border-b-transparent border-l-sky-400/30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
              
              {/* Core Pulsing Dot */}
              <motion.div
                className="w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)]"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              />
            </div>

            {/* Message Bar */}
            <motion.div
              className="relative px-8 py-3 bg-white/10 border border-white/20 shadow-2xl rounded-full backdrop-blur-xl overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              {/* Shimmer effect inside the message pill */}
              <motion.div
                className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-100%", "50%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
              <p className="relative text-white font-medium tracking-widest uppercase text-sm z-10">
                {message}
              </p>
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}