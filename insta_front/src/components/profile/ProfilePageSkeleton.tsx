import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { BACKGROUNDS } from "@/constants/styles";

export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className={`min-h-screen px-4 py-10 flex justify-center items-start ${BACKGROUNDS.profile}`}>
      <div className="w-full max-w-[920px] rounded-2xl border border-white/60 bg-white/75 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-5">
          {/* Instagram 로고 스켈레톤 */}
          <Skeleton variant="text" width={180} height={36} className="bg-gradient-to-r from-pink-200 to-violet-200" />

          {/* 버튼들 스켈레톤 */}
          <div className="flex items-center gap-3">
            <Skeleton variant="rectangular" width={100} height={40} className="rounded-xl" />
            <Skeleton variant="rectangular" width={80} height={40} className="rounded-xl" />
          </div>
        </div>

        {/* Profile Row Skeleton */}
        <div className="flex flex-row items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="shrink-0">
            <div className="relative w-50 h-50 rounded-full p-[3px] bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200 animate-pulse">
              <div className="w-full h-full rounded-full bg-white p-1">
                <Skeleton variant="circular" className="w-full h-full bg-gradient-to-br from-pink-200/50 to-violet-200/50" />
              </div>
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* 닉네임 스켈레톤 */}
            <Skeleton variant="text" width={150} height={32} className="mb-2" />

            {/* 아이디 스켈레톤 */}
            <Skeleton variant="text" width={120} height={20} className="mb-4" />

            {/* 통계 스켈레톤 */}
            <div className="mt-4 flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[92px] text-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2.5">
                  <Skeleton variant="text" width={40} height={24} className="mx-auto mb-1" />
                  <Skeleton variant="text" width={50} height={14} className="mx-auto" />
                </div>
              ))}
            </div>

            {/* 바이오 스켈레톤 */}
            <div className="mt-4 rounded-2xl border border-black/10 bg-white/65 px-4 py-3">
              <Skeleton variant="text" width={80} height={20} className="mb-2" />
              <Skeleton variant="text" width="100%" height={16} className="mb-1" />
              <Skeleton variant="text" width="70%" height={16} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,47,179,0.55),rgba(123,44,255,0.55),transparent)]" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="aspect-square rounded-2xl bg-gradient-to-br from-pink-200/30 to-violet-200/30" />
          ))}
        </div>
      </div>
    </div>
  );
};
