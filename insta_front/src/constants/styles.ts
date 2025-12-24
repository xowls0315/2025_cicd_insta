// 공통 스타일 클래스
export const STYLES = {
  gradient: "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600",
  gradientText: "bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent",
  hoverScale: "cursor-pointer transition-all duration-500 hover:scale-105",
} as const;

// 배경 그라데이션
export const BACKGROUNDS = {
  login: "bg-[radial-gradient(circle_at_20%_10%,rgba(255,77,141,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(123,44,255,0.12),transparent_45%)]",
  profile: "bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(255,45,181,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(120,0,255,0.20),transparent_55%),linear-gradient(180deg,#ffffff,#faf7ff)]",
} as const;

