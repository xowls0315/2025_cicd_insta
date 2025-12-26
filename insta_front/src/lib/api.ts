import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, LoginResponse, User, Feed } from "@/types";

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
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? "요청 처리 중 오류가 발생했습니다.";
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

// ========== Axios Interceptors 추가 ==========

// 1. Request Interceptor: 모든 요청에 자동으로 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: 401 에러 시 자동 토큰 갱신 및 재시도
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러이고 아직 retry하지 않은 요청인 경우
    if (isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
      // 이미 refresh 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // refresh token으로 새 access token 받기
        const newToken = await authApi.refresh();
        tokenManager.set(newToken);

        // 대기 중인 요청들 처리
        processQueue(null, newToken);

        // 원래 요청을 새 토큰으로 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // refresh 실패 시 대기 중인 요청들 모두 실패 처리
        processQueue(refreshError, null);
        tokenManager.remove();

        // 로그인 페이지로 리다이렉트
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

    const res = await apiClient.get<ApiResponse<User>>("/users/me");
    return (res.data?.data ?? res.data) as User;
  },

  updateProfile: async (formData: FormData): Promise<User> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.patch<ApiResponse<User>>("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return (res.data?.data ?? res.data) as User;
  },
};

// 피드 API
export const feedApi = {
  create: async (formData: FormData): Promise<Feed> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.post<ApiResponse<Feed>>("/feeds", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return (res.data?.data ?? res.data) as Feed;
  },

  getMyFeeds: async (): Promise<Feed[]> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.get<ApiResponse<Feed[]>>("/feeds/me");
    return (res.data?.data ?? res.data ?? []) as Feed[];
  },

  getFeed: async (id: number): Promise<Feed> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.get<ApiResponse<Feed>>(`/feeds/${id}`);
    return (res.data?.data ?? res.data) as Feed;
  },

  update: async (id: number, formData: FormData): Promise<Feed> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const res = await apiClient.patch<ApiResponse<Feed>>(`/feeds/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return (res.data?.data ?? res.data) as Feed;
  },

  delete: async (id: number): Promise<void> => {
    const token = tokenManager.get();
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    await apiClient.delete(`/feeds/${id}`);
  },
};
