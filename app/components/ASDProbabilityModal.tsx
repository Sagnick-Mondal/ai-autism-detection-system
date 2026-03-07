"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ASDModalProps {
  isOpen: boolean;
  autismProbability: number;
  nonAutismProbability: number;
  onContinue: () => void;
  onClose: () => void;
}

export default function ASDProbabilityModal({
  isOpen,
  autismProbability,
  nonAutismProbability,
  onContinue,
  onClose,
}: ASDModalProps) {

  const finalDecision =
    autismProbability > nonAutismProbability
      ? "Autistic Traits Detected"
      : "Non-Autistic";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div
              className="
                w-full max-w-md p-8
                rounded-3xl
                bg-white/70 dark:bg-white/10
                backdrop-blur-2xl
                border border-slate-200 dark:border-white/20
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              "
            >
              {/* Accent Line */}
              <div className="h-1 w-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#001f65] to-[#6895FD]" />

              <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
                ASD Screening Result
              </h2>

              <p className="text-center text-slate-600 dark:text-slate-300 mt-3">
                The screening model analyzed facial traits and produced the following probabilities:
              </p>

              {/* Autism Bar (Blue) */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300 mb-2">
                  <span>Autism</span>
                  <span>{autismProbability.toFixed(2)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${autismProbability}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-[#001f65] to-[#6895FD]"
                  />
                </div>
              </div>

              {/* Non Autism Bar (Green) */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300 mb-2">
                  <span>Non-Autism</span>
                  <span>{nonAutismProbability.toFixed(2)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${nonAutismProbability}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                  />
                </div>
              </div>

              {/* Final Decision */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Final Decision
                </p>
                <p
                  className={`mt-2 text-lg font-semibold ${
                    autismProbability > nonAutismProbability
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {finalDecision}
                </p>
              </div>

              {/* Dynamic Button */}
              {autismProbability > nonAutismProbability ? (
                <button
                  onClick={onContinue}
                  className="
                    mt-10 w-full py-3 rounded-full
                    bg-gradient-to-br from-[#001f65] to-[#6895FD]
                    text-white font-semibold
                    shadow-lg
                    hover:scale-[1.03]
                    transition-all duration-200
                  "
                >
                  Continue to Emotion Analysis
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="
                    mt-10 w-full py-3 rounded-full
                    bg-slate-200 dark:bg-white/10
                    text-slate-800 dark:text-white font-semibold
                    border border-slate-300 dark:border-white/20
                    shadow-sm
                    hover:scale-[1.03]
                    transition-all duration-200
                  "
                >
                  Return to Scanner
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}