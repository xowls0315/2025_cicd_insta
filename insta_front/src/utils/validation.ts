import type { SignupFormData } from "@/types";

// 회원가입 폼 검증
export const validateSignupForm = (form: SignupFormData): { isValid: boolean; error?: string } => {
  if (!form.username.trim()) {
    return { isValid: false, error: "아이디를 입력해주세요." };
  }
  if (!form.nickname.trim()) {
    return { isValid: false, error: "닉네임을 입력해주세요." };
  }
  if (!form.password.trim()) {
    return { isValid: false, error: "비밀번호를 입력해주세요." };
  }
  if (!form.passwordConfirm.trim()) {
    return { isValid: false, error: "비밀번호 확인을 입력해주세요." };
  }
  if (form.password !== form.passwordConfirm) {
    return { isValid: false, error: "비밀번호가 일치하지 않아요." };
  }
  if (!form.file) {
    return { isValid: false, error: "프로필 사진을 선택해주세요." };
  }
  return { isValid: true };
};

// FormData 생성 헬퍼
export const createSignupFormData = (form: SignupFormData): FormData => {
  const formData = new FormData();
  formData.append("username", form.username);
  formData.append("nickname", form.nickname);
  formData.append("password", form.password);
  formData.append("passwordConfirm", form.passwordConfirm);
  if (form.file) {
    formData.append("file", form.file);
  }
  return formData;
};

// 프로필 수정 FormData 생성
export const createUpdateProfileFormData = (
  username?: string,
  nickname?: string,
  password?: string,
  file?: File | null,
  currentUsername?: string,
  currentNickname?: string
): FormData => {
  const formData = new FormData();
  if (username && username.trim() && username !== currentUsername) {
    formData.append("username", username.trim());
  }
  if (nickname && nickname.trim() && nickname !== currentNickname) {
    formData.append("nickname", nickname.trim());
  }
  if (password && password.trim()) {
    formData.append("password", password.trim());
  }
  if (file) {
    formData.append("file", file);
  }
  return formData;
};

// FormData에 변경사항이 있는지 확인
export const hasFormDataChanges = (formData: FormData): boolean => {
  return !formData.entries().next().done;
};

