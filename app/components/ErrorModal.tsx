"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorModal({
  isOpen,
  title = "Image Analysis Failed",
  message,
  onClose,
  actionLabel = "Try Another Image",
  onAction,
}: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Blur Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <div
              className="
                relative w-full max-w-md
                rounded-3xl
                bg-white/70 dark:bg-white/10
                backdrop-blur-2xl
                border border-slate-200 dark:border-white/20
                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                p-8
              "
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="
                  absolute top-4 right-4
                  text-slate-500 dark:text-slate-300
                  hover:text-slate-800 dark:hover:text-white
                  transition
                "
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="p-4 rounded-full bg-red-500/20 text-red-500 dark:text-red-400">
                  <AlertTriangle size={30} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
                {title}
              </h2>

              {/* Message */}
              <p className="text-center text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                {message}
              </p>

              {/* Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onAction?.();
                }}
                className="
                  mt-8 w-full py-3 rounded-full
                  bg-gradient-to-br from-[#001f65] to-[#6895FD]
                  text-white font-semibold
                  shadow-lg
                  hover:scale-[1.03]
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                {actionLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}