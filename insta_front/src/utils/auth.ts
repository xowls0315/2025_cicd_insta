import { tokenManager } from "@/lib/api";

// 인증 상태 확인 및 리다이렉트
export const checkAuthAndRedirect = (): boolean => {
  const token = tokenManager.get();
  if (!token) {
    if (typeof window !== "undefined") {
      tokenManager.remove();
      window.location.href = "/";
    }
    return false;
  }
  return true;
};

// 로그아웃 처리
export const handleLogout = async (logoutFn: () => Promise<void>): Promise<void> => {
  try {
    await logoutFn();
  } finally {
    tokenManager.remove();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};
