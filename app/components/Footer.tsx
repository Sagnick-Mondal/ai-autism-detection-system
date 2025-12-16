"use client";

import { motion } from "framer-motion";
import {
  Github,
  BookOpen,
  Info,
  Mail,
  HeartHandshake,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-32 w-full">
      {/* Gradient Divider */}
      <div className="h-[1px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="
          px-6 py-16
          bg-white/60 dark:bg-white/5
          backdrop-blur-xl
          border-t border-slate-200 dark:border-white/10
        "
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ================= BRAND ================= */}
          <div>
            <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tl from-[#001f65] via-sky-400 to-[#6895FD]">
              AutiSense
            </h3>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              An explainable AI system designed to support emotion recognition
              in children with Autism Spectrum Disorder. Built with transparency,
              ethics, and clinical relevance at its core.
            </p>
          </div>

          {/* ================= LINKS ================= */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info size={18} /> Quick Links
            </h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li>
                <Link href="/" className="hover:text-purple-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-500 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#app" className="hover:text-purple-500 transition">
                  Emotion Detection
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= RESOURCES ================= */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen size={18} /> Resources
            </h4>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
              <li>
                <a
                  href="https://github.com/Sagnick-Mondal/ai-autism-detection-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-purple-500 transition"
                >
                  <Github size={18} /> GitHub Repository
                </a>
              </li>

              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span>satyaki.jishu@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>
            © {new Date().getFullYear()} AutiSense. All rights reserved.
          </span>

          <span className="flex items-center gap-2">
            Built with <HeartHandshake size={16} className="text-pink-500" /> for
            inclusive intelligence
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
