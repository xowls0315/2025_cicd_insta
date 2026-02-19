import React from "react";
import type { User } from "@/types";

interface ProfileInfoProps {
  user: User;
  feedCount?: number;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, feedCount = 0 }) => {
  const stats = [
    { n: feedCount, label: "게시물" },
    { n: 0, label: "팔로워" },
    { n: 0, label: "팔로잉" },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full text-center sm:text-left">
      <div className="text-xl sm:text-2xl md:text-[26px] font-black leading-tight truncate">{user.nickname}</div>
      <div className="mt-1 text-sm sm:text-base font-bold text-black/60 truncate">@{user.username}</div>

      {/* meta */}
      <div className="mt-3 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
        {stats.map((v) => (
          <div key={v.label} className="min-w-[72px] sm:min-w-[92px] text-center rounded-xl sm:rounded-2xl border border-black/10 bg-white/70 px-3 py-2 sm:px-4 sm:py-2.5">
            <div className="text-base sm:text-lg font-black">{v.n}</div>
            <div className="text-[10px] sm:text-xs font-extrabold text-black/60">{v.label}</div>
          </div>
        ))}
      </div>

      {/* bio */}
      <div className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl border border-black/10 bg-white/65 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="text-sm sm:text-base font-extrabold">내 프로필</div>
        <div className="mt-1 text-xs sm:text-sm text-black/70">Next.js + NestJS + Supabase로 만든 인스타 클론 바이브 코딩 ✨</div>
      </div>
    </div>
  );
};
