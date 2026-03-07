/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineUpload, AiOutlineCamera } from "react-icons/ai";
import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { toast } from "react-toastify";
import ASDProbabilityModal from "../components/ASDProbabilityModal";
import GlobalLoader from "../components/GlobalLoader";
import { useEmotionStore } from "../store/emotionStore";

export default function EmotionDetectionApp() {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { userId } = useAuth();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Error modal states removed, handled by toast directly

  // ASD modal
  const [asdModalOpen, setAsdModalOpen] = useState(false);
  const [autismProb, setAutismProb] = useState(0);
  const [nonAutismProb, setNonAutismProb] = useState(0);

  // Global Loader
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Analyzing image...");

  const handleFileSelect = (chosenFile?: File) => {
    if (!chosenFile) return;
    setFile(chosenFile);
    setSelectedImage(URL.createObjectURL(chosenFile));
    setMobileMenuOpen(false);
  };

  // ===============================
  // MAIN PIPELINE
  // ===============================
  const handleEvaluate = async () => {
    if (!file) return;

    setGlobalLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 1️⃣ AGE CHECK
      setLoaderMessage("Checking age...");
      const ageResponse = await fetch(
        "http://127.0.0.1:8000/check-age",
        { method: "POST", body: formData }
      );

      const ageData = await ageResponse.json();

      if (!ageResponse.ok) {
        throw new Error(ageData.detail);
      }

      // 2️⃣ ASD CHECK
      setLoaderMessage("Analyzing ASD traits...");
      const asdResponse = await fetch(
        " http://127.0.0.1:8000/check-asd",
        { method: "POST", body: formData }
      );

      const asdData = await asdResponse.json();

      if (!asdResponse.ok) {
        throw new Error(asdData.detail);
      }

      setAutismProb(asdData.autism_probability);
      setNonAutismProb(asdData.non_autism_probability);

      setAsdModalOpen(true);

    } catch (err: any) {
      toast.error(
        err?.message ||
          "We could not analyze this image. Please try a clearer facial photo."
      );
      setFile(null);
      setSelectedImage(null);
    } finally {
      setGlobalLoading(false);
    }
  };

  // ===============================
  // CONTINUE TO EMOTION
  // ===============================
  const handleContinueToEmotion = async () => {
    if (!file) return;

    setGlobalLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setLoaderMessage("Generating emotion heatmap...");

      const response = await fetch(
        "http://127.0.0.1:8000/predict-emotion",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Emotion analysis failed");
      }

      useEmotionStore.getState().setEmotionResult(data, selectedImage!);

      if (userId) {
        try {
          // We convert the File to base64 so we can safely pass it to our API route
          // The API route (running on server) will bypass CORS and upload natively via Admin SDK
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
             reader.onload = () => resolve(reader.result as string);
             reader.readAsDataURL(file!);
          });
          const b64Image = await base64Promise;

          setLoaderMessage("Saving results...");
          const { saveDetectionResult } = await import("../../lib/db");
          
          await saveDetectionResult(userId, {
            emotion: data.emotion,
            best_method: data.best_method,
            probabilities: data.probabilities,
            xai_scores: data.xai_scores,
            imageFileName: file!.name,
            imageBase64: b64Image // we pass base64 to server to let server do the uploading
          });
        } catch (e) {
          console.error("Failed to save to firebase", e);
        }
      }

      setAsdModalOpen(false);
      router.push("/result");

    } catch (err: any) {
      toast.error(err.message);
      setFile(null);
      setSelectedImage(null);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <>
      <section className="pt-28 pb-32 px-6 flex flex-col items-center">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-[#001f65] via-sky-400 to-[#6895FD]">
            Emotion Detection
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300">
            Upload or capture a facial image and let AutiSense analyze emotional
            cues using explainable artificial intelligence.
          </p>
        </motion.div>

        {/* GLASS CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="
            mt-16 w-full max-w-lg p-8
            bg-white/10 dark:bg-white/5
            backdrop-blur-xl
            border border-white/20 dark:border-white/10
            rounded-3xl
            shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            flex flex-col items-center gap-6
          "
        >
          {/* IMAGE PREVIEW */}
          {selectedImage ? (
            <motion.img
              src={selectedImage}
              alt="Preview"
              className="w-60 h-60 object-cover rounded-2xl shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          ) : (
            <div className="w-60 h-60 flex flex-col items-center justify-center gap-2 bg-white/20 dark:bg-white/10 text-slate-600 dark:text-gray-300 rounded-2xl border border-white/30">
              <Brain size={32} />
              <span className="text-sm">Image Preview</span>
            </div>
          )}

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex w-full gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => uploadInputRef.current?.click()}
              disabled={!userId}
              className="flex-1 flex items-center justify-center gap-2 border border-white/30 rounded-full p-3 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <AiOutlineUpload size={22} />
              Upload
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => cameraInputRef.current?.click()}
              disabled={!userId}
              className="flex-1 flex items-center justify-center gap-2 border border-white/30 rounded-full p-3 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <AiOutlineCamera size={22} />
              Take Photo
            </motion.button>
          </div>

          {/* MOBILE */}
          <div className="md:hidden w-full relative">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMobileMenuOpen((p) => !p)}
              disabled={!userId}
              className="w-full flex items-center justify-center gap-2 border border-white/30 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineUpload size={22} />
              Choose Image
            </motion.button>

            <AnimatePresence>
              {mobileMenuOpen && userId && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-3 bg-white/80 dark:bg-black/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <button
                    onClick={() => uploadInputRef.current?.click()}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/30"
                  >
                    <AiOutlineUpload />
                    Upload from Gallery
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/30"
                  >
                    <AiOutlineCamera />
                    Take a Photo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!userId && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400 text-center">
              Please sign in to upload and analyze your image.
            </p>
          )}

          {/* INPUTS */}
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          {/* ANALYZE BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleEvaluate}
            disabled={!file || globalLoading}
            className="
              w-full px-6 py-3 rounded-full
              bg-gradient-to-br from-[#001f65] to-[#6895FD]
              text-white font-semibold
              shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Analyze Emotion
          </motion.button>
        </motion.div>
      </section>

      {/* MODALS */}
      <ASDProbabilityModal
        isOpen={asdModalOpen}
        autismProbability={autismProb}
        nonAutismProbability={nonAutismProb}
        onContinue={handleContinueToEmotion}
        onClose={() => setAsdModalOpen(false)}
      />

      <GlobalLoader isOpen={globalLoading} message={loaderMessage} />
    </>
  );
}