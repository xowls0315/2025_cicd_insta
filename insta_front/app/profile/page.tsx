"use client";

import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { FeedGrid } from "@/components/feeds/FeedGrid";
import { FeedCreateModal } from "@/components/feeds/FeedCreateModal";
import { FeedViewModal } from "@/components/feeds/FeedViewModal";
import { FeedEditModal } from "@/components/feeds/FeedEditModal";
import { userApi, authApi, feedApi, getErrorMessage } from "@/lib/api";
import { handleLogout } from "@/utils/auth";
import { BACKGROUNDS } from "@/constants/styles";
import type { User, Feed } from "@/types";

export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(true);
  const [isCreateFeedModalOpen, setIsCreateFeedModalOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditFeedModalOpen, setIsEditFeedModalOpen] = useState(false);

  const fetchMe = async () => {
    try {
      const userData = await userApi.getMe();
      setMe(userData);
    } catch (error) {
      alert(getErrorMessage(error));
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeeds = async () => {
    try {
      const feedsData = await feedApi.getMyFeeds();
      setFeeds(feedsData);
    } catch (error) {
      console.error("피드 로딩 실패:", error);
    } finally {
      setFeedsLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    await handleLogout(() => authApi.logout());
  };

  const handleEditSuccess = (updatedUser: User) => {
    setMe(updatedUser);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchMe();
    fetchFeeds();
  }, []);

  useEffect(() => {
    // me가 바뀌면 이미지 에러 상태 초기화
    setImgError(false);
  }, [me?.profileImageUrl]);

  if (loading) return <ProfilePageSkeleton />;
  if (!me) return null;

  return (
    <div className={`min-h-screen px-4 py-10 flex justify-center items-start ${BACKGROUNDS.profile}`}>
      <div className="w-full max-w-[920px] rounded-2xl border border-white/60 bg-white/75 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.10)] p-6">
        <ProfileHeader onEditClick={() => setIsEditModalOpen(true)} onLogoutClick={handleLogoutClick} />

        {/* profile row */}
        <div className="flex flex-row items-center gap-6">
          <ProfileAvatar user={me} imgError={imgError} onImgError={() => setImgError(true)} />
          <ProfileInfo user={me} feedCount={feeds.length} />
        </div>

        {/* divider */}
        <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,47,179,0.55),rgba(123,44,255,0.55),transparent)]" />

        {/* 피드 섹션 */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xl font-black">내 피드</div>
          <button
            onClick={() => setIsCreateFeedModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 text-white font-extrabold cursor-pointer transition-all duration-500 hover:scale-105 shadow-lg text-sm"
          >
            + 새 피드
          </button>
        </div>

        {feedsLoading ? (
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl border border-black/10 bg-gradient-to-br from-pink-200/30 to-violet-200/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <FeedGrid
            feeds={feeds}
            onFeedClick={(feed) => {
              setSelectedFeed(feed);
              setIsViewModalOpen(true);
            }}
          />
        )}
      </div>

      <ProfileEditModal isOpen={isEditModalOpen} user={me} onClose={() => setIsEditModalOpen(false)} onSuccess={handleEditSuccess} />

      {/* 피드 모달들 */}
      <FeedCreateModal
        isOpen={isCreateFeedModalOpen}
        onClose={() => setIsCreateFeedModalOpen(false)}
        onSuccess={(newFeed) => {
          setFeeds([newFeed, ...feeds]);
          setIsCreateFeedModalOpen(false);
        }}
      />

      <FeedViewModal
        isOpen={isViewModalOpen}
        feed={selectedFeed}
        user={me}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFeed(null);
        }}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditFeedModalOpen(true);
        }}
      />

      <FeedEditModal
        isOpen={isEditFeedModalOpen}
        feed={selectedFeed}
        onClose={() => {
          setIsEditFeedModalOpen(false);
          setSelectedFeed(null);
        }}
        onSuccess={(updatedFeed) => {
          setFeeds(feeds.map((f) => (f.id === updatedFeed.id ? updatedFeed : f)));
          setIsEditFeedModalOpen(false);
          setSelectedFeed(null);
        }}
        onDelete={(id) => {
          setFeeds(feeds.filter((f) => f.id !== id));
          setIsEditFeedModalOpen(false);
          setSelectedFeed(null);
        }}
      />
    </div>
  );
}
