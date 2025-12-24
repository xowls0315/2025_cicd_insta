import axios, { AxiosError } from "axios";
import type { ApiResponse, LoginResponse, User, UpdateProfileFormData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// 에러 타입 가드
export const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};

// 에러 메시지 추출
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? "요청 처리 중 오류가 발생했습니다.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

// 토큰 관리
export const tokenManager = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  },
  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", token);
  },
  remove: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
  },
};

// 인증 API
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", {
      username,
      password,
    });
    const accessToken = res.data?.data?.accessToken;
    if (!accessToken) {
      throw new Error("accessToken이 없습니다.");
    }
    return { accessToken };
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },

  refresh: async (): Promise<string> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>("/auth/refresh");
    const accessToken = res.data?.data?.accessToken;
    if (!accessToken) {
      throw new Error("refresh missing accessToken");
    }
    return accessToken;
  },
};

// 사용자 API
export const userApi = {
  signup: async (formData: FormData): Promise<void> => {
    await apiClient.post("/users/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getMe: async (): Promise<User> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    try {
      const res = await apiClient.get<ApiResponse<User>>("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.data ?? res.data;
    } catch (error) {
      // 토큰 만료 시 refresh 시도
      if (isAxiosError(error) && error.response?.status === 401) {
        try {
          const newToken = await authApi.refresh();
          tokenManager.set(newToken);
          const res = await apiClient.get<ApiResponse<User>>("/users/me", {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          return res.data?.data ?? res.data;
        } catch {
          tokenManager.remove();
          throw new Error("인증에 실패했습니다.");
        }
      }
      throw error;
    }
  },

  updateProfile: async (formData: FormData): Promise<User> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.patch<ApiResponse<User>>("/users/me", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data?.data ?? res.data;
  },
};

