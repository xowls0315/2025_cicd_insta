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
        min-h-screen p-6 grid place-items-center
        bg-white
        ${BACKGROUNDS.login}
      `}
    >
      <div
        className="
          w-[420px] max-w-full
          rounded-2xl overflow-hidden
          bg-white
          shadow-[0_18px_60px_rgba(0,0,0,0.08)]
          border border-black/5
        "
      >
        <div className={`px-6 py-5 text-white font-extrabold text-3xl ${STYLES.gradient}`}>{mode === "login" ? "Instagram Login" : "Instagram Sign Up"}</div>

        <div className="px-6 pt-5 pb-6">
          {mode === "login" ? <LoginForm onSwitchToSignup={() => setMode("signup")} /> : <SignupForm onSwitchToLogin={() => setMode("login")} onSuccess={() => setMode("login")} />}
        </div>
      </div>
    </div>
  );
}
