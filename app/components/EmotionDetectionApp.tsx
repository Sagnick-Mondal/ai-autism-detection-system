/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineUpload, AiOutlineCamera } from "react-icons/ai";
import {
  Smile,
  Frown,
  Angry,
  Zap,
  Meh,
  Brain,
} from "lucide-react";

/* ================= TYPES ================= */

type Emotion =
  | "Happy"
  | "Sad"
  | "Angry"
  | "Surprised"
  | "Neutral";

interface PredictionResult {
  predicted_class: Emotion;
  confidence: number;
  error?: string;
}

/* ================= ICON MAP ================= */

const EMOTION_ICONS: Record<Emotion, React.ReactNode> = {
  Happy: <Smile size={32} className="text-yellow-500" />,
  Sad: <Frown size={32} className="text-blue-500" />,
  Angry: <Angry size={32} className="text-red-500" />,
  Surprised: <Zap size={32} className="text-purple-500" />,
  Neutral: <Meh size={32} className="text-gray-400" />,
};

export default function EmotionDetectionApp() {
  /* ================= REFS ================= */

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  /* ================= STATE ================= */

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ================= HANDLERS ================= */

  const handleFileSelect = (chosenFile?: File) => {
    if (!chosenFile) return;

    setFile(chosenFile);
    setSelectedImage(URL.createObjectURL(chosenFile));
    setResult(null);
    setMobileMenuOpen(false);
  };

  const handleUploadChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleCameraChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileSelect(e.target.files?.[0]);
  };

  const handleEvaluate = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch {
      setResult({
        predicted_class: "Neutral",
        confidence: 0,
        error: "Could not connect to server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 pb-32 px-6 flex flex-col items-center">
      {/* ================= HEADER ================= */}
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

      {/* ================= CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="
          mt-16 w-full max-w-lg p-8
          bg-white/80 dark:bg-white/5
          backdrop-blur-2xl
          border border-slate-200 dark:border-white/20
          rounded-3xl
          shadow-xl
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
          <div className="w-60 h-60 flex flex-col items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-gray-300 rounded-2xl border border-slate-200 dark:border-white/20">
            <Brain size={32} />
            <span className="text-sm">Image Preview</span>
          </div>
        )}

        {/* ================= UPLOAD CONTROLS ================= */}

        {/* DESKTOP */}
        <div className="hidden md:flex w-full gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => uploadInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/30 dark:hover:bg-white/10 rounded-full p-3"
          >
            <AiOutlineUpload size={22} />
            Upload
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 dark:border-white/30 rounded-full p-3"
          >
            <AiOutlineCamera size={22} />
            Take Photo
          </motion.button>
        </div>

        {/* MOBILE */}
        <div className="md:hidden w-full relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="w-full flex items-center justify-center gap-2 border border-slate-300 dark:border-white/30 rounded-full p-3"
          >
            <AiOutlineUpload size={22} />
            Choose Image
          </motion.button>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 right-0 mt-3 bg-white dark:bg-black border border-slate-200 dark:border-white/20 rounded-2xl shadow-xl z-20 overflow-hidden"
              >
                <button
                  onClick={() => uploadInputRef.current?.click()}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <AiOutlineUpload />
                  Upload from Gallery
                </button>

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full px-5 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <AiOutlineCamera />
                  Take a Photo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HIDDEN INPUTS */}
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          onChange={handleUploadChange}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture
          onChange={handleCameraChange}
          className="hidden"
        />

        {/* ANALYZE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          onClick={handleEvaluate}
          disabled={loading || !file}
          className="
            w-full px-6 py-3 rounded-full
            bg-gradient-to-br from-[#001f65] to-[#6895FD]
            text-white font-semibold
            shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? "Analyzing..." : "Analyze Emotion"}
        </motion.button>

        {/* RESULT */}
        {result && (
          <motion.div
            className="w-full mt-4 p-5 bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded-2xl text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <>
                <div className="flex items-center justify-center gap-3 mb-2">
                  {EMOTION_ICONS[result.predicted_class]}
                  <p className="text-2xl font-bold">
                    {result.predicted_class}
                  </p>
                </div>

                <div className="w-full bg-slate-300 dark:bg-white/20 h-3 rounded-full overflow-hidden mt-4">
                  <motion.div
                    className="h-3 bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                <p className="mt-2">
                  {result.confidence}% Confidence
                </p>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
