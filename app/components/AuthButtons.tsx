"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";

export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        className="
          flex items-center justify-center gap-3
          w-full py-3 rounded-xl
          bg-white text-black
          font-medium
          hover:scale-[1.02]
          transition
        "
      >
        <FaGoogle size={20} />
        Continue with Google
      </button>

      <button
        className="
          flex items-center justify-center gap-3
          w-full py-3 rounded-xl
          bg-black text-white
          border border-white/20
          font-medium
          hover:scale-[1.02]
          transition
        "
      >
        <FaGithub size={20} />
        Continue with GitHub
      </button>
    </div>
  );
}
