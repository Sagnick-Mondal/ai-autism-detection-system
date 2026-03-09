import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import ShootingStars from "./components/ShootingStars";
import ThemeProvider from "./components/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutiSense - Emotion Detection for Autistic Children",
  description: "AI-powered emotion detection for autistic children.",
  icons: {
    icon: "./icon.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${inter.className} min-h-screen w-full relative overflow-hidden transition-colors duration-300 text-slate-800 dark:text-slate-100 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 dark:bg-black dark:bg-none`}>
      <ThemeProvider>
        <AuthProvider>
          {/* Dark mode animation layer */}
          <ShootingStars />
          {/* App content */}
          <div className="relative z-10">{children}</div>
          {/* Toast Notifications */}
          <ToastContainer 
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </body>
    </html>
  );
}
