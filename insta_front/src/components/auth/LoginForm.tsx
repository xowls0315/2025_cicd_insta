"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { STYLES } from "@/constants/styles";
import { authApi, tokenManager, getErrorMessage } from "@/lib/api";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginId.trim() || !loginPw.trim()) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken } = await authApi.login(loginId, loginPw);
      tokenManager.set(accessToken);
      window.location.href = "/profile";
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input placeholder="아이디" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
      <Input placeholder="비밀번호" type="password" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} />

      <Button onClick={handleLogin} variant="primary" isLoading={isLoading} className="mt-5 w-full rounded-full py-3">
        로그인
      </Button>

      <div className="mt-4 text-center text-sm text-black/55">
        계정이 없나요?{" "}
        <button onClick={onSwitchToSignup} className="font-extrabold text-fuchsia-600 cursor-pointer transition-all duration-500 hover:scale-105">
          회원가입
        </button>
      </div>
    </>
  );
};

