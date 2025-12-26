"use client";

import { useMemo } from "react";
import type { Feed, User } from "@/types";

interface FeedViewModalProps {
  isOpen: boolean;
  feed: Feed | null;
  user: User | null;
  onClose: () => void;
  onEdit: () => void;
}

export const FeedViewModal: React.FC<FeedViewModalProps> = ({ isOpen, feed, user, onClose, onEdit }) => {
  const avatarFallback = useMemo(() => {
    if (!user) return "U";
    const name = user.nickname || user.username || "U";
    return name.trim().slice(0, 1).toUpperCase();
  }, [user]);

  if (!isOpen || !feed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl h-[85vh] max-h-[800px] rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.20)] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 - 그라데이션 배경 */}
        <div className="px-6 py-4 text-white font-extrabold text-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 flex items-center justify-between shrink-0">
          <div>피드</div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-sm cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg border border-blue-300/50"
            >
              수정
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* 이미지 섹션 - 고정 크기 */}
          <div className="w-full md:w-1/2 bg-black flex items-center justify-center min-h-[300px] md:min-h-0">
            <img src={feed.photoUrl} alt="feed" className="w-full h-full object-cover max-h-full" />
          </div>

          {/* 내용 섹션 */}
          <div className="w-full md:w-1/2 flex flex-col min-h-0">
            {/* 프로필 헤더 */}
            {user && (
              <div className="px-6 py-4 border-b border-black/10 flex items-center gap-3 shrink-0">
                <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 to-violet-200">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-black text-zinc-700">{avatarFallback}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[18px] font-extrabold text-base text-black/90">{user.nickname}</div>
                </div>
              </div>
            )}

            {/* 설명 */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <div className="text-[16px] leading-[1.8] whitespace-pre-wrap text-black/85 font-medium tracking-wide">{feed.description}</div>
            </div>

            {/* 날짜 */}
            <div className="px-6 py-4 border-t border-black/10 text-xs text-black/50 bg-gray-50/50 shrink-0">{new Date(feed.createdAt).toLocaleString("ko-KR")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
