"use client";

import { useUpdatePassword } from "@/global/api/useAuthQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { Eye, EyeOff, Lock } from "lucide-react";

export function UpdatePw() {
  const router = useRouter();
  const { mutate, isPending } = useUpdatePassword();

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  const validate = () => {
    if (!oldPw || !newPw || !newPw2) {
      toast({
        title: "입력 필요",
        description: "현재/새 비밀번호를 모두 입력해주세요.",
      });
      return false;
    }
    if (newPw !== newPw2) {
      toast({
        title: "불일치",
        description: "새 비밀번호와 확인이 일치하지 않습니다.",
      });
      return false;
    }
    if (newPw.length < 8) {
      toast({
        title: "보안 권장",
        description: "새 비밀번호는 최소 8자 이상을 권장합니다.",
      });
      // 정책상 필수면 return false;
    }
    if (oldPw === newPw) {
      toast({
        title: "변경 필요",
        description: "새 비밀번호는 현재 비밀번호와 달라야 합니다.",
      });
      return false;
    }
    return true;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    mutate(
      { oldPassword: oldPw, newPassword: newPw },
      {
        onSuccess: (res) => {
          toast({
            title: "변경 완료",
            description: res.message,
          });
          router.replace("/auth/login");
        },
        onError: (err: any) => {
          const msg =
            err?.message ??
            err?.data?.message ??
            "비밀번호 변경에 실패했습니다.";
          toast({ title: "실패", description: msg });
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
        <CardDescription>
          현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {/* 현재 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="old-password">현재 비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="old-password"
                name="oldPassword"
                type={showOld ? "text" : "password"}
                placeholder="현재 비밀번호"
                className="pl-10 pr-10"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowOld((v) => !v)}
              >
                {showOld ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* 새 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password"
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="새 비밀번호"
                className="pl-10 pr-10"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNew((v) => !v)}
              >
                {showNew ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* 새 비밀번호 확인 */}
          <div className="space-y-2">
            <Label htmlFor="new-password2">새 비밀번호 확인</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-password2"
                name="newPasswordConfirm"
                type={showNew2 ? "text" : "password"}
                placeholder="새 비밀번호를 한 번 더 입력하세요"
                className="pl-10 pr-10"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNew2((v) => !v)}
              >
                {showNew2 ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
