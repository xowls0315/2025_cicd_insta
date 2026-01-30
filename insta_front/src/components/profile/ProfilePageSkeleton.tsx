"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import { BACKGROUNDS } from "@/constants/styles";

export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div
      className={`min-h-screen px-4 py-10 flex justify-center items-start ${BACKGROUNDS.profile}`}
    >
      <div className="w-full max-w-[920px] rounded-2xl border border-white/60 bg-white/75 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-5">
          <Skeleton width={180} height={36} className="rounded" />
          <div className="flex items-center gap-3">
            <Skeleton width={100} height={40} className="rounded-xl" />
            <Skeleton width={80} height={40} className="rounded-xl" />
          </div>
        </div>

        {/* Profile Row Skeleton */}
        <div className="flex flex-row items-center gap-6">
          <div className="shrink-0 w-[120px] h-[120px]">
            <Skeleton circle width={120} height={120} />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <Skeleton width={150} height={32} className="mb-2" />
            <Skeleton width={120} height={20} className="mb-4" />
            <div className="mt-4 flex flex-wrap gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="min-w-[92px] text-center rounded-2xl border border-black/10 bg-white/70 px-4 py-2.5"
                >
                  <Skeleton width={40} height={24} className="mx-auto mb-1" />
                  <Skeleton width={50} height={14} className="mx-auto" />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-black/10 bg-white/65 px-4 py-3">
              <Skeleton width={80} height={20} className="mb-2" />
              <Skeleton height={16} className="mb-1" />
              <Skeleton height={16} width="70%" />
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,47,179,0.55),rgba(123,44,255,0.55),transparent)]" />

        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
