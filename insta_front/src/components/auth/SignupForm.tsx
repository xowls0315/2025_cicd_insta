"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { userApi, getErrorMessage } from "@/lib/api";
import { validateSignupForm, createSignupFormData } from "@/utils/validation";
import type { SignupFormData } from "@/types";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const [form, setForm] = useState<SignupFormData>({
    username: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const validation = validateSignupForm(form);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsLoading(true);
    try {
      const formData = createSignupFormData(form);
      await userApi.signup(formData);
      alert("회원가입 완료! 로그인 해주세요.");
      onSuccess();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        placeholder="아이디(중복 불가)"
        value={form.username}
        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
      />
      <Input
        placeholder="닉네임"
        value={form.nickname}
        onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
      />
      <Input
        placeholder="비밀번호"
        type="password"
        value={form.password}
        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
      />
      <Input
        placeholder="비밀번호 확인"
        type="password"
        value={form.passwordConfirm}
        onChange={(e) => setForm((prev) => ({ ...prev, passwordConfirm: e.target.value }))}
      />

      <FileUpload
        file={form.file}
        onFileChange={(file) => setForm((prev) => ({ ...prev, file }))}
        label="프로필 사진 선택"
      />

      <Button onClick={handleSignup} variant="primary" isLoading={isLoading} className="mt-5 w-full rounded-full py-3">
        회원가입
      </Button>

      <div className="mt-4 text-center text-sm text-black/55">
        이미 계정이 있나요?{" "}
        <button onClick={onSwitchToLogin} className="font-extrabold text-fuchsia-600 cursor-pointer transition-all duration-500 hover:scale-105">
          로그인
        </button>
      </div>
    </>
  );
};

