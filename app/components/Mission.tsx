"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Eye, HeartHandshake } from "lucide-react";
import { useEffect, useState } from "react";

const sections = [
  {
    title: "Purpose",
    icon: HeartHandshake,
    color: "text-pink-400",
    text: `AutiSense was created with a single purpose — to bridge the gap between advanced artificial intelligence and human emotional understanding. Children with Autism Spectrum Disorder often struggle to interpret facial emotions, and our project exists to provide clarity, empathy, and early emotional support through explainable AI-driven insights.`,
  },
  {
    title: "Mission",
    icon: Target,
    color: "text-purple-400",
    text: `Our mission is to develop an ethical, transparent, and clinically meaningful emotion recognition system that empowers caregivers, educators, and therapists. By combining deep learning with Explainable AI techniques, we aim to build trust in AI-assisted decision-making while enabling early intervention and personalized emotional support.`,
  },
  {
    title: "Vision",
    icon: Eye,
    color: "text-blue-400",
    text: `Our vision is a future where artificial intelligence does not replace human judgment, but strengthens it — creating inclusive, emotionally intelligent, and supportive environments for neurodiverse individuals across the world.`,
  },
];

export default function MissionVisionPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate on mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sections.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* ================= VIDEO WRAPPER ================= */}
      <div className="relative w-11/12 h-[85vh] rounded-3xl overflow-hidden">
        {/* Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dbqwutroe/video/upload/f_auto,q_auto,w_1920/autism_ibynpa.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* ================= TEXT CONTENT ================= */}
        <div className="relative z-10 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="w-full px-6 md:px-20 lg:px-28 text-white"
          >
            <div className="max-w-4xl">
              {/* Heading */}
              <h1 className="text-3xl md:text-5xl font-extrabold mb-8">
                Our Mission & Vision
              </h1>

              {/* ================= DESKTOP CONTENT ================= */}
              <div className="hidden md:block">
                {sections.map((sec, i) => {
                  const Icon = sec.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 mb-8">
                      <Icon
                        size={28}
                        className={`${sec.color} mt-1 shrink-0`}
                      />
                      <p className="text-base md:text-xl text-slate-200 leading-relaxed">
                        {sec.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* ================= MOBILE DYNAMIC CONTENT ================= */}
              <div className="md:hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-start gap-4"
                  >
                    {(() => {
                      const Icon = sections[activeIndex].icon;
                      return (
                        <Icon
                          size={26}
                          className={`${sections[activeIndex].color} mt-1 shrink-0`}
                        />
                      );
                    })()}

                    <p className="text-base text-slate-200 leading-relaxed">
                      {sections[activeIndex].text}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Dots indicator */}
                <div className="flex gap-2 mt-6">
                  {sections.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        i === activeIndex
                          ? "bg-white w-4"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
