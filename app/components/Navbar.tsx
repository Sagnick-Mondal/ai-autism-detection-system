"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { name: "About Us", href: "/about" },
    {
      name: "Resources",
      href: "https://github.com/Sagnick-Mondal/ai-autism-detection-system/tree/Main",
    }
  ];

  return (
    <nav
      className="
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[95%] max-w-5xl
        rounded-2xl
        bg-white/15 dark:bg-black/20
        backdrop-blur-xl
        border border-white/20 dark:border-white/10
        shadow-lg shadow-black/5
      "
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Logo />

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="hidden md:block px-4 py-2 text-sm font-medium border border-white/30 rounded-xl hover:bg-white/20 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          {/* Dropdown Button */}
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="
              p-2 rounded-xl
              bg-white/20 dark:bg-white/10
              hover:bg-white/30 dark:hover:bg-white/20
              transition-colors
            "
            aria-label="Open menu"
          >
            <AiOutlineMenu
              size={22}
              className="text-slate-800 dark:text-slate-100"
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              mx-4 mb-4
              rounded-xl
              bg-white/20 dark:bg-black/30
              backdrop-blur-xl
              border border-white/20 dark:border-white/10
              overflow-hidden
            "
          >
            <div className="flex flex-col divide-y divide-white/10">
              {navItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setOpenMenu(false)}
                    className="
                      px-5 py-3
                      text-slate-900 dark:text-slate-100
                      hover:bg-white/20 dark:hover:bg-white/10
                      transition-colors
                    "
                  >
                    {item.name}
                  </a>
              ))}

              <SignedOut>
                <div className="md:hidden">
                  <SignInButton mode="modal">
                    <button className="w-full px-5 py-3 text-left text-slate-900 dark:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
