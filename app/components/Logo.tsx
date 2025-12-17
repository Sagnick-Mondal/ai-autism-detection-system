import Typewriter from "typewriter-effect";
import { rounded } from "@/app/fonts";

interface LogoProps {
  size?: number;
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
      {/* LOGO TEXT */}
      {showText && (
        <div className="leading-tight select-none">
          <a
            href="/"
            className={`
              block text-2xl font-extrabold ${rounded.className}
              bg-clip-text text-transparent
              bg-gradient-to-tl from-[#001f65] via-sky-400 to-[#6895FD]
              whitespace-nowrap
            `}
          >
            <Typewriter
              options={{
                strings: ["AutiSense"],
                autoStart: true,
                loop: true,
                delay: 100,
                cursor: "",
              }}
            />
          </a>

          <p className="text-xs text-slate-600 dark:text-slate-300 tracking-wide">
            Emotion. Intelligence. Insight.
          </p>
        </div>
      )}
    </div>
  );
}
