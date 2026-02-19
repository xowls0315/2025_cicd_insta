"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { STYLES, BACKGROUNDS } from "@/constants/styles";

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div
      className={`
        min-h-screen p-4 sm:p-6 grid place-items-center
        bg-white
        ${BACKGROUNDS.login}
      `}
    >
      <div
        className="
          w-full max-w-[420px]
          rounded-xl sm:rounded-2xl overflow-hidden
          bg-white
          shadow-[0_18px_60px_rgba(0,0,0,0.08)]
          border border-black/5
          mx-2 sm:mx-0
        "
      >
        <div className={`px-4 py-4 sm:px-6 sm:py-5 text-white font-extrabold text-2xl sm:text-3xl ${STYLES.gradient}`}>{mode === "login" ? "Instagram Login" : "Instagram Sign Up"}</div>

        <div className="px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
          {mode === "login" ? <LoginForm onSwitchToSignup={() => setMode("signup")} /> : <SignupForm onSwitchToLogin={() => setMode("login")} onSuccess={() => setMode("login")} />}
        </div>
      </div>
    </div>
  );
}
