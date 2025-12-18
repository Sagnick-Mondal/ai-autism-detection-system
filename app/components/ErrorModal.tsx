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
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="
                relative w-full max-w-md
                bg-white/10 dark:bg-white/5
                backdrop-blur-2xl
                border border-white/20
                rounded-3xl
                shadow-2xl
                p-8
                text-white
              "
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-300 hover:text-white"
              >
                <X />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-red-500/20 text-red-400">
                  <AlertTriangle size={32} />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center">
                {title}
              </h2>

              {/* Message */}
              <p className="text-center text-gray-300 mt-3 leading-relaxed">
                {message}
              </p>

              {/* Action */}
              <button
                onClick={() => {
                  onClose();
                  onAction?.();
                }}
                className="
                  mt-8 w-full py-3 rounded-xl
                  bg-gradient-to-br from-[#001f65] to-[#6895FD]
                  text-white font-semibold
                  shadow-lg
                  hover:scale-[1.02]
                  transition
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
