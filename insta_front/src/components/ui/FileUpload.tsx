import React from "react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  label?: string;
  optional?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileChange,
  accept = "image/*",
  label = "프로필 사진 선택",
  optional = false,
}) => {
  return (
    <label className="mt-4 block w-full cursor-pointer">
      <input
        type="file"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        className="hidden"
        accept={accept}
      />
      <div className="w-full rounded-lg sm:rounded-xl border-2 border-dashed border-fuchsia-300 bg-gradient-to-br from-pink-50 to-violet-50 px-3 py-4 sm:px-4 sm:py-5 text-center transition-all duration-300 hover:border-fuchsia-500 hover:bg-gradient-to-br hover:from-pink-100 hover:to-violet-100 hover:scale-[1.02]">
        {file ? (
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="text-xs sm:text-sm font-extrabold text-fuchsia-600">✓ 파일 선택됨</div>
            <div className="text-[10px] sm:text-xs text-black/60 truncate max-w-full">{file.name}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <div className="text-sm sm:text-base font-extrabold text-fuchsia-600">📷 {label}</div>
            <div className="text-[10px] sm:text-xs text-black/50">
              클릭하여 이미지 파일을 선택하세요{optional ? " (선택사항)" : ""}
            </div>
          </div>
        )}
      </div>
    </label>
  );
};

