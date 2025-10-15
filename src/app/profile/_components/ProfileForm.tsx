"use client";

import {
  useFetchMe,
  useModifyUser,
  useRemoveUser,
} from "@/global/api/useAuthQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { toast } from "@/global/hooks/useToast";
import { useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConfirmWithPassword } from "./ConfirmWithPassword";
import { ProfileImagePicker } from "./ProfileImagePicker";

export function ProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, isLoading } = useFetchMe();
  const { mutate, isPending } = useModifyUser();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { mutate: removeMutate, isPending: isRemovePending } = useRemoveUser();
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const onSave = async () => {
    const form = formRef.current!;
    const fd = new FormData(form);
    const nickname = String(fd.get("nickname") || "");
    const email = String(fd.get("email") || "");

    const requestFormData = new FormData();
    requestFormData.append(
      "reqBody",
      new Blob([JSON.stringify({ nickname, email })], {
        type: "application/json",
      }),
    );
    if (profileFile) {
      requestFormData.append("file", profileFile);
    }

    mutate(requestFormData, {
      onSuccess: () => {
        setIsEditMode(false);
      },
      onError: (res) => {
        toast({
          title: "실패",
          description: res.message,
        });
      },
    });
  };

  const onCancel = () => {
    formRef.current?.reset(); // ← 입력값을 초기값으로 원복
    setIsEditMode(false); // ← 편집모드 종료
  };

  const handleRemoveUser = async (password: string) => {
    removeMutate(
      { password },
      {
        onSuccess: () => {
          toast({
            title: "탈퇴가 완료되었습니다.",
            description: "다음에 다시 이용해주세요...",
          });
          router.replace("/");
        },
        onError: (res) => {
          toast({
            title: "실패",
            description: res.message,
          });
        },
      },
    );
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => e.preventDefault()}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>프로필 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileImagePicker
            currentImageUrl={data?.data.profileImageUrl}
            onFileChange={setProfileFile}
            disabled={!isEditMode}
          />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                defaultValue={data ? data.data.nickname : ""}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                defaultValue={data ? data.data.email : ""}
                disabled={!isEditMode}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Link href="/profile/updatepw">
          <Button type="button" variant="outline" size="lg">
            비밀번호 수정
          </Button>
        </Link>
        {isEditMode ? (
          <>
            <Button
              type="button"
              disabled={isPending || isLoading}
              size="lg"
              onClick={onSave}
            >
              저장
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              size="lg"
              onClick={onCancel}
            >
              취소
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => setIsEditMode(true)}
              size="lg"
            >
              수정
            </Button>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="w-full flex justify-between items-center">
              <h1>회원 탈퇴</h1>
              <ConfirmWithPassword
                title="회원 탈퇴"
                description="삭제된 계정은 복구할 수 없습니다. 정말 탈퇴하시겠습니까?"
                triggerText="탈퇴"
                confirmText="탈퇴하기"
                loadingText="탈퇴 중..."
                onConfirm={async (password) => {
                  if (!password.trim()) return;
                  try {
                    await handleRemoveUser(password); // 성공 시에만 아래 실행
                  } catch (e) {
                    throw e;
                  }
                }}
              />
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </form>
  );
}
