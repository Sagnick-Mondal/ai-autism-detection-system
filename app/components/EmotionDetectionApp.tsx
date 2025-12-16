/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineUpload, AiOutlineCamera } from "react-icons/ai";
import { Smile, Frown, Angry, Zap, Meh, Brain } from "lucide-react";

const EMOTION_ICONS: Record<string, JSX.Element> = {
  Happy: <Smile size={32} className="text-yellow-500" />,
  Sad: <Frown size={32} className="text-blue-500" />,
  Angry: <Angry size={32} className="text-red-500" />,
  Surprised: <Zap size={32} className="text-purple-500" />,
  Neutral: <Meh size={32} className="text-gray-400" />,
};

export default function EmotionDetectionApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleImage = (chosenFile: File) => {
    setFile(chosenFile);
    setSelectedImage(URL.createObjectURL(chosenFile));
    setResult(null);
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files?.[0];
    if (chosenFile) handleImage(chosenFile);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosenFile = e.target.files?.[0];
    if (chosenFile) handleImage(chosenFile);
  };

  const handleEvaluate = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: "Could not connect to server." });
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
        transition={{ duration: 1 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-[#001f65] via-sky-400 to-[#6895FD]">
          Emotion Detection
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          Upload or capture a facial image and let AutiSense analyze emotional
          cues using explainable artificial intelligence.
        </p>
      </motion.div>

      {/* ================= CARD ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
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
        {/* Image Preview */}
        {selectedImage ? (
          <motion.img
            key={selectedImage}
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

        {/* Upload + Camera Buttons */}
        <div className="flex w-full gap-4">
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/30 text-slate-700 dark:text-gray-100 rounded-full p-3 hover:bg-slate-100 dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            <AiOutlineUpload size={22} />
            Upload
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-white/30 text-slate-700 dark:text-gray-100 rounded-full p-3 hover:bg-slate-100 dark:hover:bg-white dark:hover:text-black transition-all duration-300"
          >
            <AiOutlineCamera size={22} />
            {isMobile ? "Take a Photo" : "Upload from Camera"}
          </button>
        </div>

        {/* Hidden Inputs */}
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

        {/* Submit */}
        <button
          onClick={handleEvaluate}
          disabled={loading || !file}
          className="
            w-full flex items-center justify-center gap-3
            px-6 py-3
            bg-gradient-to-br from-[#001f65] to-[#6895FD]
            text-white font-semibold
            rounded-full
            shadow-lg
            hover:scale-105 hover:shadow-2xl
            transition-transform duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading && (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          )}
          {loading ? "Analyzing..." : "Analyze Emotion"}
        </button>

        {/* ================= RESULT ================= */}
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
                  {EMOTION_ICONS[result.predicted_class] || <Meh size={32} />}
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
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

                <p className="text-slate-600 dark:text-slate-300 mt-2">
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
