"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import { LogOut, User as UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const navItems = [
    { name: "About Us", href: "/about" },
    {
      name: "Resources",
      href: "https://github.com/Sagnick-Mondal/ai-autism-detection-system/tree/Main",
    }
  ];

  return (
    <>
      <nav
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-40
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

            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-full">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                      ) : (
                        <UserIcon size={18} className="text-slate-700 dark:text-slate-200" />
                      )}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[120px]">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="p-2 text-slate-700 dark:text-slate-200 hover:bg-white/30 dark:hover:bg-white/10 rounded-full transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="hidden md:block px-4 py-2 text-sm font-medium border border-white/30 rounded-xl hover:bg-white/20 transition-colors dark:text-white"
                  >
                    Sign In
                  </button>
                )}
              </>
            )}

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

                {!loading && !user && (
                  <div className="md:hidden">
                    <button
                      onClick={() => {
                        setLoginModalOpen(true);
                        setOpenMenu(false);
                      }}
                      className="w-full px-5 py-3 text-left text-slate-900 dark:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}
                {!loading && user && (
                  <div className="md:hidden">
                    <button
                      onClick={() => {
                        logout();
                        setOpenMenu(false);
                      }}
                      className="w-full px-5 py-3 text-left text-slate-900 dark:text-slate-100 hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center justify-between"
                    >
                      Sign Out
                      <LogOut size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
