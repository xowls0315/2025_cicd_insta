"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { feedApi, getErrorMessage } from "@/lib/api";
import type { Feed } from "@/types";

interface FeedEditModalProps {
  isOpen: boolean;
  feed: Feed | null;
  onClose: () => void;
  onSuccess: (feed: Feed) => void;
  onDelete: (id: number) => void;
}

export const FeedEditModal: React.FC<FeedEditModalProps> = ({ isOpen, feed, onClose, onSuccess, onDelete }) => {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (feed) {
      setDescription(feed.description);
      setFile(null);
    }
  }, [feed, isOpen]);

  const handleUpdate = async () => {
    if (!feed) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      if (description.trim() !== feed.description) {
        formData.append("description", description.trim());
      }
      if (file) {
        formData.append("file", file);
      }

      // 변경사항이 없으면 알림
      if (!formData.has("description") && !formData.has("file")) {
        alert("변경할 내용이 없습니다.");
        setIsUpdating(false);
        return;
      }

      const updatedFeed = await feedApi.update(feed.id, formData);
      alert("피드가 수정되었습니다!");
      onSuccess(updatedFeed);
      handleClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!feed) return;
    if (!confirm("정말 이 피드를 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await feedApi.delete(feed.id);
      alert("피드가 삭제되었습니다!");
      onDelete(feed.id);
      handleClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setFile(null);
    onClose();
  };

  if (!isOpen || !feed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.20)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 text-white font-extrabold text-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600">피드 수정</div>

        <div className="px-6 pt-5 pb-6">
          <div className="mb-4">
            <img src={feed.photoUrl} alt="feed" className="w-full rounded-xl object-cover max-h-[300px]" />
          </div>

          <FileUpload file={file} onFileChange={setFile} label="사진 변경" optional />

          <textarea
            placeholder="설명을 입력하세요..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 w-full min-h-[120px] border-0 border-b border-black/15 px-1 py-3 outline-none placeholder:text-black/35 focus:border-fuchsia-500 resize-none"
            maxLength={2000}
          />

          <div className="mt-6 flex gap-3">
            <Button onClick={handleDelete} variant="secondary" isLoading={isDeleting} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200">
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
            <Button onClick={handleClose} variant="secondary" className="flex-1">
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
