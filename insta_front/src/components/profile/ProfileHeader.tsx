import React from "react";
import { Button } from "@/components/ui/Button";

interface ProfileHeaderProps {
  onEditClick: () => void;
  onLogoutClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick, onLogoutClick }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5">
      <div className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent order-first">
        Instagram
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button onClick={onEditClick} variant="primary" className="flex-1 sm:flex-none text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5">
          프로필 수정
        </Button>
        <Button onClick={onLogoutClick} variant="outline" className="flex-1 sm:flex-none text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2.5">
          로그아웃
        </Button>
      </div>
    </div>
  );
};

