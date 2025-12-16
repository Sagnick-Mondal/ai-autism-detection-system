"use client";

import Image from "next/image";

interface LogoProps {
  size?: number; // size in px
  showText?: boolean;
  className?: string;
}

export default function Logo({
  size = 60,
  showText = true,
  className = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* LOGO ICON 
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0"
      >
        <Image
          src="/autistic.svg"
          alt="AutiSense Logo"
          fill
          priority
          className="object-contain"
        />
      </div> */}

      {/* LOGO TEXT */}
      {showText && (
        <div className="leading-tight select-none">
          <a href="/" className="text-xl font font-extrabold bg-clip-text text-transparent bg-gradient-to-tl from-[#001f65] via-sky-400 to-[#6895FD]">
            AutiSense
          </a>
          <p className="text-xs text-slate-600 dark:text-slate-300 tracking-wide">
            Emotion. Intelligence. Insight.
          </p> 
        </div>
      )}
    </div>
  );
}
