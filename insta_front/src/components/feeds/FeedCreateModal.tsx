"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { feedApi, getErrorMessage } from "@/lib/api";
import type { Feed } from "@/types";

interface FeedCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (feed: Feed) => void;
}

export const FeedCreateModal: React.FC<FeedCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!description.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }
    if (!file) {
      alert("사진을 선택해주세요.");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      formData.append("file", file);

      const newFeed = await feedApi.create(formData);
      alert("피드가 생성되었습니다!");
      onSuccess(newFeed);
      handleClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto" onClick={handleClose}>
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.20)] my-auto" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-4 sm:px-6 sm:py-5 text-white font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 shrink-0">새 피드 작성</div>

        <div className="px-4 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6">
          <FileUpload file={file} onFileChange={setFile} label="사진 선택" />

          <textarea
            placeholder="설명을 입력하세요..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 w-full min-h-[120px] border-0 border-b border-black/15 px-1 py-3 outline-none placeholder:text-black/35 focus:border-fuchsia-500 resize-none"
            maxLength={2000}
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button onClick={handleClose} variant="secondary" className="flex-1 w-full sm:w-auto">
              취소
            </Button>
            <Button onClick={handleCreate} variant="primary" isLoading={isCreating} className="flex-1 w-full sm:w-auto">
              {isCreating ? "작성 중..." : "작성 완료"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
