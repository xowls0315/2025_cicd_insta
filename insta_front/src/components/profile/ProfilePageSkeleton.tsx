"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import { BACKGROUNDS } from "@/constants/styles";

export const ProfilePageSkeleton: React.FC = () => {
  return (
    <div
      className={`min-h-screen px-3 py-6 sm:px-4 sm:py-8 md:py-10 flex justify-center items-start ${BACKGROUNDS.profile}`}
    >
      <div className="w-full max-w-[920px] rounded-xl sm:rounded-2xl border border-white/60 bg-white/75 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-4 sm:p-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
          <Skeleton width={180} height={36} className="rounded" />
          <div className="flex gap-2 sm:gap-3">
            <Skeleton width={100} height={40} className="rounded-xl" />
            <Skeleton width={80} height={40} className="rounded-xl" />
          </div>
        </div>

        {/* Profile Row Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto sm:mx-0 flex items-center justify-center">
            <Skeleton circle width={96} height={96} />
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <Skeleton width={150} height={32} className="mb-2 mx-auto sm:mx-0" />
            <Skeleton width={120} height={20} className="mb-4 mx-auto sm:mx-0" />
            <div className="mt-3 sm:mt-4 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="min-w-[72px] sm:min-w-[92px] text-center rounded-xl sm:rounded-2xl border border-black/10 bg-white/70 px-3 py-2 sm:px-4 sm:py-2.5"
                >
                  <Skeleton width={40} height={24} className="mx-auto mb-1" />
                  <Skeleton width={50} height={14} className="mx-auto" />
                </div>
              ))}
            </div>
            <div className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl border border-black/10 bg-white/65 px-3 py-2.5 sm:px-4 sm:py-3">
              <Skeleton width={80} height={20} className="mb-2" />
              <Skeleton height={16} className="mb-1" />
              <Skeleton height={16} width="70%" />
            </div>
          </div>
        </div>

        <div className="my-4 sm:my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,47,179,0.55),rgba(123,44,255,0.55),transparent)]" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl sm:rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
