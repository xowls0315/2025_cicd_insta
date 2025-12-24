import React, { useMemo } from "react";
import type { User } from "@/types";

interface ProfileAvatarProps {
  user: User;
  imgError: boolean;
  onImgError: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, imgError, onImgError }) => {
  const avatarFallback = useMemo(() => {
    const name = user?.nickname || user?.username || "U";
    return name.trim().slice(0, 1).toUpperCase();
  }, [user]);

  const showImage = !!user.profileImageUrl && !imgError;

  return (
    <div className="shrink-0">
      <div
        className="relative w-50 h-50 rounded-full p-[3px]
        bg-[conic-gradient(from_180deg,#ff2fb3,#7b2cff,#ff7a18,#ff2fb3)]"
      >
        <div className="w-full h-full rounded-full bg-white p-1">
          {showImage ? (
            <img
              src={user.profileImageUrl as string}
              alt="profile"
              className="w-full h-full rounded-full object-cover block"
              onError={onImgError}
            />
          ) : (
            <div
              className="w-full h-full rounded-full grid place-items-center
              bg-gradient-to-br from-pink-500/15 to-violet-600/15 text-[40px] font-black text-zinc-800"
            >
              {avatarFallback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

