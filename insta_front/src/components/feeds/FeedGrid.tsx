"use client";

import React from "react";
import type { Feed } from "@/types";

interface FeedGridProps {
  feeds: Feed[];
  onFeedClick: (feed: Feed) => void;
}

export const FeedGrid: React.FC<FeedGridProps> = ({ feeds, onFeedClick }) => {
  if (feeds.length === 0) {
    return (
      <div className="text-center py-12 text-black/50">
        <div className="text-2xl mb-2">📷</div>
        <div className="font-extrabold">아직 피드가 없습니다</div>
        <div className="text-sm mt-1">새 피드를 작성해보세요!</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {feeds.map((feed) => (
        <div
          key={feed.id}
          onClick={() => onFeedClick(feed)}
          className="relative aspect-square rounded-2xl border border-black/10 bg-white/70 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group"
        >
          <img src={feed.photoUrl} alt="feed" className="w-full h-full object-cover group-hover:opacity-60" />
        </div>
      ))}
    </div>
  );
};
