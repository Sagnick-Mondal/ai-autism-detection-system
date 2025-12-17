import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ShootingStars from "./components/ShootingStars";
import ThemeProvider from "./components/ThemeProvider";
import AuthModal from "./components/AuthModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutiSense - Emotion Detection for Autistic Children",
  description: "AI-powered emotion detection for autistic children.",
  icons: {
    icon: [
      {url:"/icon.svg", type:"image/svg+xml" }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
    ${inter.className}
    min-h-screen w-full relative overflow-hidden
    transition-colors duration-300

    text-slate-800 dark:text-slate-100

    /* LIGHT MODE ONLY */
    bg-gradient-to-br
    from-slate-50 via-indigo-50 to-purple-100

    /* DARK MODE OVERRIDES */
    dark:bg-black
    dark:bg-none
  `}
      >
        <ThemeProvider>
          <AuthModal />
          {/* Dark mode animation layer */}
          <ShootingStars />
          {/* App content */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
