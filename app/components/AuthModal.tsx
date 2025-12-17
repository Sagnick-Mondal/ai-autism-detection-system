"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuthModal } from "./useAuthModal";
import AuthButtons from "./AuthButtons";

export default function AuthModal() {
  const { isOpen, mode, close, open } = useAuthModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            className="
              fixed z-50 inset-0
              flex items-center justify-center
              px-4
            "
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
                onClick={close}
                className="absolute top-4 right-4 text-gray-300 hover:text-white"
              >
                <X />
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold text-center">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="text-center text-gray-300 mt-2">
                {mode === "login"
                  ? "Sign in to continue"
                  : "Join AutiSense in seconds"}
              </p>

              {/* OAuth */}
              <div className="mt-8">
                <AuthButtons />
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px bg-white/20 flex-1" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="h-px bg-white/20 flex-1" />
              </div>

              {/* Email placeholder */}
              <button
                className="
                  w-full py-3 rounded-xl
                  border border-white/30
                  text-white
                  hover:bg-white hover:text-black
                  transition
                "
              >
                Continue with Email
              </button>

              {/* Switch */}
              <p className="text-center text-sm text-gray-400 mt-6">
                {mode === "login" ? (
                  <>
                    Don’t have an account?{" "}
                    <button
                      onClick={() => open("signup")}
                      className="text-white no-underline hover:text-sky-400 transition-all ease-in-out duration-300"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => open("login")}
                      className="text-white no-underline hover:text-sky-400 transition-all ease-in-out duration-300"
                    >
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
