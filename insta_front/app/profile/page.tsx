"use client";

import { useEffect, useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { ProfilePageSkeleton } from "@/components/profile/ProfilePageSkeleton";
import { userApi, authApi, getErrorMessage } from "@/lib/api";
import { handleLogout } from "@/utils/auth";
import { BACKGROUNDS } from "@/constants/styles";
import type { User } from "@/types";

export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleLogoutClick = async () => {
    await handleLogout(() => authApi.logout());
  };

  const handleEditSuccess = (updatedUser: User) => {
    setMe(updatedUser);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchMe();
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
          <ProfileInfo user={me} />
        </div>

        {/* divider */}
        <div className="my-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,47,179,0.55),rgba(123,44,255,0.55),transparent)]" />

        {/* grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl border border-black/10
                bg-gradient-to-br from-pink-500/15 to-violet-600/15"
            />
          ))}
        </div>
      </div>

      <ProfileEditModal isOpen={isEditModalOpen} user={me} onClose={() => setIsEditModalOpen(false)} onSuccess={handleEditSuccess} />
    </div>
  );
}
