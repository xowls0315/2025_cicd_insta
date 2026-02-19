"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { userApi, getErrorMessage } from "@/lib/api";
import { STYLES } from "@/constants/styles";

type Tab = "id" | "pw";

interface FindIdPwModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FindIdPwModal: React.FC<FindIdPwModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<Tab>("id");

  // 아이디 찾기
  const [findIdNickname, setFindIdNickname] = useState("");
  const [foundUsernames, setFoundUsernames] = useState<string[] | null>(null);
  const [findIdLoading, setFindIdLoading] = useState(false);

  // 비밀번호 재설정
  const [resetUsername, setResetUsername] = useState("");
  const [resetNickname, setResetNickname] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetNewPasswordConfirm, setResetNewPasswordConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleFindUsername = async () => {
    if (!findIdNickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    setFindIdLoading(true);
    setFoundUsernames(null);
    try {
      const { usernames } = await userApi.findUsername(findIdNickname);
      setFoundUsernames(usernames);
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setFindIdLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetUsername.trim() || !resetNickname.trim()) {
      alert("아이디와 닉네임을 입력해주세요.");
      return;
    }
    if (resetNewPassword.length < 6) {
      alert("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (resetNewPassword !== resetNewPasswordConfirm) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    setResetLoading(true);
    try {
      await userApi.resetPassword({
        username: resetUsername,
        nickname: resetNickname,
        newPassword: resetNewPassword,
        newPasswordConfirm: resetNewPasswordConfirm,
      });
      alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
      handleClose();
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setResetLoading(false);
    }
  };

  const handleClose = () => {
    setTab("id");
    setFindIdNickname("");
    setFoundUsernames(null);
    setResetUsername("");
    setResetNickname("");
    setResetNewPassword("");
    setResetNewPasswordConfirm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.20)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`px-4 py-4 sm:px-6 sm:py-5 text-white font-extrabold text-xl sm:text-2xl shrink-0 ${STYLES.gradient}`}
        >
          ID / PW 찾기
        </div>

        {/* 탭 */}
        <div className="flex border-b border-black/10 shrink-0">
          <button
            type="button"
            onClick={() => setTab("id")}
            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold ${
              tab === "id"
                ? "text-fuchsia-600 border-b-2 border-fuchsia-600"
                : "text-black/50"
            } ${STYLES.hoverScale}`}
          >
            아이디 찾기
          </button>
          <button
            type="button"
            onClick={() => setTab("pw")}
            className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold ${
              tab === "pw"
                ? "text-fuchsia-600 border-b-2 border-fuchsia-600"
                : "text-black/50"
            } ${STYLES.hoverScale}`}
          >
            비밀번호 재설정
          </button>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-5">
          {tab === "id" && (
            <div className="space-y-4">
              <p className="text-sm text-black/65">
                가입 시 사용한 <strong>닉네임</strong>을 입력하면 해당하는 아이디를 알려드립니다.
              </p>
              <Input
                placeholder="닉네임"
                value={findIdNickname}
                onChange={(e) => setFindIdNickname(e.target.value)}
              />
              <Button
                onClick={handleFindUsername}
                variant="primary"
                isLoading={findIdLoading}
                className="w-full rounded-full py-3"
              >
                아이디 찾기
              </Button>
              {foundUsernames !== null && (
                <div className="mt-4 p-4 rounded-xl bg-fuchsia-50 border border-fuchsia-200">
                  <p className="text-sm font-extrabold text-fuchsia-800 mb-2">
                    찾은 아이디
                  </p>
                  <ul className="text-sm text-fuchsia-700 space-y-1">
                    {foundUsernames.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === "pw" && (
            <div className="space-y-4">
              <p className="text-sm text-black/65">
                <strong>아이디</strong>와 <strong>닉네임</strong>으로 본인 확인 후 새 비밀번호를 설정합니다.
              </p>
              <Input
                placeholder="아이디"
                value={resetUsername}
                onChange={(e) => setResetUsername(e.target.value)}
              />
              <Input
                placeholder="닉네임"
                value={resetNickname}
                onChange={(e) => setResetNickname(e.target.value)}
              />
              <Input
                placeholder="새 비밀번호 (6자 이상)"
                type="password"
                value={resetNewPassword}
                onChange={(e) => setResetNewPassword(e.target.value)}
              />
              <Input
                placeholder="새 비밀번호 확인"
                type="password"
                value={resetNewPasswordConfirm}
                onChange={(e) => setResetNewPasswordConfirm(e.target.value)}
              />
              <Button
                onClick={handleResetPassword}
                variant="primary"
                isLoading={resetLoading}
                className="w-full rounded-full py-3"
              >
                비밀번호 재설정
              </Button>
            </div>
          )}
        </div>

        <div className="px-4 pb-4 sm:px-6 sm:pb-5 text-center shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm text-black/55 font-extrabold cursor-pointer transition-all duration-500 hover:scale-105 hover:text-fuchsia-600"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
