// 사용자 관련 타입
export type User = {
  id?: number;
  username: string;
  nickname: string;
  profileImageUrl: string | null;
};

// API 응답 타입
export type ApiResponse<T = unknown> = {
  data?: T;
  message?: string;
  ok?: boolean;
};

// 로그인 응답 타입
export type LoginResponse = {
  accessToken: string;
};

// 회원가입 폼 타입
export type SignupFormData = {
  username: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  file: File | null;
};

// 로그인 폼 타입
export type LoginFormData = {
  username: string;
  password: string;
};

// 프로필 수정 폼 타입
export type UpdateProfileFormData = {
  username?: string;
  nickname?: string;
  password?: string;
  file?: File | null;
};
