"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { userApi, getErrorMessage } from "@/lib/api";
import { createUpdateProfileFormData, hasFormDataChanges } from "@/utils/validation";
import type { User, UpdateProfileFormData } from "@/types";

interface ProfileEditModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, user, onClose, onSuccess }) => {
  const [form, setForm] = useState<UpdateProfileFormData>({
    username: "",
    nickname: "",
    password: "",
    file: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setForm({
        username: user.username,
        nickname: user.nickname,
        password: "",
        file: null,
      });
    }
  }, [isOpen, user]);

  const handleUpdate = async () => {
    setIsUpdating(true);

    try {
      const formData = createUpdateProfileFormData(
        form.username,
        form.nickname,
        form.password,
        form.file,
        user.username,
        user.nickname
      );

      if (!hasFormDataChanges(formData)) {
        alert("변경할 내용이 없습니다.");
        setIsUpdating(false);
        return;
      }

      const updatedUser = await userApi.updateProfile(formData);
      alert("프로필이 수정되었습니다!");
      onSuccess(updatedUser);
      onClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.20)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* 모달 헤더 */}
        <div className="px-6 py-5 text-white font-extrabold text-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600">
          프로필 수정
        </div>

        {/* 모달 내용 */}
        <div className="px-6 pt-5 pb-6">
          <Input
            placeholder="아이디"
            value={form.username ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          />
          <Input
            placeholder="닉네임"
            value={form.nickname ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, nickname: e.target.value }))}
          />
          <Input
            placeholder="새 비밀번호 (변경하지 않으려면 비워두세요)"
            type="password"
            value={form.password ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />

          <FileUpload
            file={form.file ?? null}
            onFileChange={(file) => setForm((prev) => ({ ...prev, file }))}
            label="프로필 사진 변경"
            optional
          />

          {/* 버튼들 */}
          <div className="mt-6 flex gap-3">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              취소
            </Button>
            <Button onClick={handleUpdate} variant="primary" isLoading={isUpdating} className="flex-1">
              {isUpdating ? "수정 중..." : "수정 완료"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

