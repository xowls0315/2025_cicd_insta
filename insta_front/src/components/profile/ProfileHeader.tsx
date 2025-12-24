import React from "react";
import { Button } from "@/components/ui/Button";

interface ProfileHeaderProps {
  onEditClick: () => void;
  onLogoutClick: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick, onLogoutClick }) => {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="text-3xl font-black tracking-tight bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
        Instagram
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={onEditClick} variant="primary">
          프로필 수정
        </Button>
        <Button onClick={onLogoutClick} variant="outline">
          로그아웃
        </Button>
      </div>
    </div>
  );
};

