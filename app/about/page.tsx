"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Brain,
  ShieldCheck,
  Eye,
  Activity,
  Users,
  ClipboardEdit,
  Send,
  Eraser,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  /* ================= IMAGE CAROUSEL ================= */
  const images = [
    "/autistic01.jpeg",
    "/autistic02.jpeg",
    "/autistic03.jpeg",
    "/autistic04.jpeg",
    "/autistic05.jpeg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FEEDBACK FORM ================= */
  const [form, setForm] = useState({
    name: "",
    age: "",
    contact: "",
    details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setForm({ name: "", age: "", contact: "", details: "" });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.contact || !form.age || !form.details) {
      toast.error("Name, email, age, and detailed feedback are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.contact)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const ageNum = parseInt(form.age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      toast.error("Please enter a valid age.");
      return;
    }

    if (form.details.trim().length < 10) {
      toast.error("Feedback details must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/save-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast.success("Thank you for your feedback");
      handleClear();
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-28 px-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-l from-[#001f65] via-sky-400 to-[#6895FD]">
          About Us
        </h1>
      </div>
      {/* ================= ABOUT (IMAGE HERO CAROUSEL) ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-24 flex justify-center"
      >
        <div className="relative w-11/12 h-[80vh] rounded-3xl overflow-hidden">
          {/* IMAGE FADE CAROUSEL */}
          <AnimatePresence>
            <motion.div
              key={currentImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <Image
                src={images[currentImage]}
                alt="AutiSense Visual"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/65" />

          {/* TEXT OVERLAY */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="px-8 md:px-20 lg:px-28 max-w-4xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="
                  text-4xl md:text-5xl font-extrabold mb-6
                  bg-clip-text text-transparent
                  text-white
                "
              >
                About AutiSense
              </motion.h1>

                <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="
                  text-sm md:text-base
                  leading-relaxed
                  text-slate-200
                "
                >
                AutiSense is a research-driven, explainable artificial
                intelligence system designed to support emotion recognition in
                children with Autism Spectrum Disorder (ASD). Children with ASD
                often experience significant difficulty in interpreting facial
                expressions and subtle emotional cues—challenges that can lead
                to social isolation, anxiety, and delayed therapeutic
                intervention. Traditional diagnostic tools are accurate but
                time-intensive, expensive, and inaccessible in many regions.
                AutiSense bridges this gap by combining CNN-based models with
                Explainable AI techniques such as Grad-CAM, Grad-CAM++, Saliency
                Maps, and SmoothGrad, delivering transparent and clinically
                meaningful emotional insights.
                </motion.p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= PROJECT FEATURES ================= */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Brain size={32} />,
            title: "Explainable AI Core",
            desc: "Visual explanations using Grad-CAM, Grad-CAM++, SmoothGrad, and Saliency Maps.",
          },
          {
            icon: <Eye size={32} />,
            title: "ASD-Focused Modeling",
            desc: "Emotion models tailored to atypical facial expressions in ASD.",
          },
          {
            icon: <ShieldCheck size={32} />,
            title: "Ethical & Reliable",
            desc: "Designed with interpretability, validation, and trust at its core.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl shadow-lg text-center"
          >
            <div className="flex justify-center mb-4 text-purple-500">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= USAGE ================= */}
      <motion.h2 className="mt-20 text-4xl font-extrabold text-center">
        How AutiSense Is Used
      </motion.h2>

      <p className="mt-6 text-lg md:text-xl text-left text-slate-600 dark:text-slate-300 max-w-5xl mx-auto">
        AutiSense supports therapists, caregivers, educators, and researchers
        by providing transparent emotional insights that assist with early
        screening, therapy sessions, and emotional training.
      </p>

      {/* ================= USAGE FEATURES ================= */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Activity size={32} />,
            title: "Therapy Support",
            desc: "Real-time emotion monitoring with explainable feedback.",
          },
          {
            icon: <Users size={32} />,
            title: "Caregiver Assistance",
            desc: "Accessible insights without technical complexity.",
          },
          {
            icon: <ClipboardEdit size={32} />,
            title: "Early Screening",
            desc: "Supports research and early emotional assessment.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl shadow-lg text-center"
          >
            <div className="flex justify-center mb-4 text-pink-500">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* ================= FEEDBACK ================= */}
      <motion.h2 className="mt-32 text-4xl font-extrabold text-center">
        Share Your Feedback
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-3xl mx-auto p-8 bg-white/70 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 rounded-2xl shadow-lg space-y-6"
      >
        <input
          name="name"
          placeholder="Name *"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/20"
        />

        <input
          name="contact"
          type="email"
          placeholder="Email *"
          value={form.contact}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/20"
        />

        <input
          name="age"
          placeholder="Age *"
          value={form.age}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/20"
        />

        <textarea
          name="details"
          placeholder="Your detailed feedback *"
          value={form.details}
          onChange={handleChange}
          required
          rows={5}
          className="w-full p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-white/20"
        />

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#001f65] to-[#6895FD] text-white font-semibold shadow-lg hover:scale-105 transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Send size={18} /> {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-400 dark:border-white/30 hover:bg-slate-200/60 dark:hover:bg-white/10 transition"
          >
            <Eraser size={18} /> Clear
          </button>
        </div>
      </form>
    </main>
  );
}
