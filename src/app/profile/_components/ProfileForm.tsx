"use client";

import { useFetchMe, useModifyUser } from "@/global/api/useAuthQuery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
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

export function ProfileForm() {
  const [isEditMode, setIsEditMode] = useState(false);
  const { data, isLoading } = useFetchMe();
  const { mutate, isPending } = useModifyUser();
  const formRef = useRef<HTMLFormElement>(null);

  const onSave = async () => {
    const form = formRef.current!;
    const fd = new FormData(form);
    const nickname = String(fd.get("nickname") || "");
    const email = String(fd.get("email") || "");
    mutate(
      { nickname, email },
      {
        onSuccess: () => {
          setIsEditMode(false);
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

  const onCancel = () => {
    formRef.current?.reset(); // ← 입력값을 초기값으로 원복
    setIsEditMode(false); // ← 편집모드 종료
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
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={"https://picsum.photos/200"} />
              <AvatarFallback>이미지</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm" type="button">
                프로필 사진 변경
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG 파일만 업로드 가능 (최대 5MB)
              </p>
            </div>
          </div>
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
        <Link href="/profile/updatepw">
          <Button type="button" variant="outline" size="lg">
            비밀번호 수정
          </Button>
        </Link>
      </div>
    </form>
  );
}
