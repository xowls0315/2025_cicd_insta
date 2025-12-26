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
    <div className="flex-1 flex flex-col min-w-0">
      <div className="text-[26px] font-black leading-tight">{user.nickname}</div>
      <div className="mt-1 font-bold text-black/60">@{user.username}</div>

      {/* meta */}
      <div className="mt-4 flex flex-wrap gap-3">
        {stats.map((v) => (
          <div key={v.label} className="min-w-[92px] text-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2.5">
            <div className="text-lg font-black">{v.n}</div>
            <div className="text-xs font-extrabold text-black/60">{v.label}</div>
          </div>
        ))}
      </div>

      {/* bio */}
      <div className="mt-4 rounded-2xl border border-black/10 bg-white/65 px-4 py-3">
        <div className="font-extrabold">내 프로필</div>
        <div className="mt-1 text-black/70">Next.js + NestJS + Supabase로 만든 인스타 클론 바이브 코딩 ✨</div>
      </div>
    </div>
  );
};
