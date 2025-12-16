"use client";

import { motion } from "framer-motion";
import { Target, Eye, HeartHandshake } from "lucide-react";

export default function MissionVisionPage() {
  return (
    <main className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* ================= VIDEO WRAPPER ================= */}
      <div className="relative w-11/12 h-[85vh] rounded-3xl overflow-hidden">
        {/* Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/dbqwutroe/video/upload/v1765911654/autism_ibynpa.mp4"
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="
              w-full
              px-8 md:px-20 lg:px-28
              text-white
            "
          >
            {/* Inner text container (shifted left) */}
            <div className="max-w-4xl">
              {/* Heading */}
              <h1 className="text-3xl md:text-5xl font-extrabold mb-10 bg-clip-text text-transparent text-white">
                Our Mission & Vision
              </h1>

              {/* Purpose */}
              <div className="flex items-start gap-4 mb-8">
                <HeartHandshake
                  size={28}
                  className="text-pink-400 mt-1 shrink-0"
                />
                <p className="text-base md:text-xl text-slate-200 leading-relaxed">
                  AutiSense was created with a single purpose — to bridge the
                  gap between advanced artificial intelligence and human
                  emotional understanding. Children with Autism Spectrum
                  Disorder often struggle to interpret facial emotions, and our
                  project exists to provide clarity, empathy, and early
                  emotional support through explainable AI-driven insights.
                </p>
              </div>

              {/* Mission */}
              <div className="flex items-start gap-4 mb-8">
                <Target
                  size={28}
                  className="text-purple-400 mt-1 shrink-0"
                />
                <p className="text-base md:text-xl text-slate-200 leading-relaxed">
                  Our mission is to develop an ethical, transparent, and
                  clinically meaningful emotion recognition system that
                  empowers caregivers, educators, and therapists. By combining
                  deep learning with Explainable AI techniques, we aim to build
                  trust in AI-assisted decision-making while enabling early
                  intervention and personalized emotional support.
                </p>
              </div>

              {/* Vision */}
              <div className="flex items-start gap-4">
                <Eye
                  size={28}
                  className="text-blue-400 mt-1 shrink-0"
                />
                <p className="text-base md:text-xl text-slate-200 leading-relaxed">
                  Our vision is a future where artificial intelligence does not
                  replace human judgment, but strengthens it — creating
                  inclusive, emotionally intelligent, and supportive
                  environments for neurodiverse individuals across the world.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
