// src/app/(auth)/forgot-password/ForgotPassword.tsx
"use client";

import { useFindPw } from "@/global/api/useAuthQuery";
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
import { FormEvent, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Mail, User } from "lucide-react";

// src/app/(auth)/forgot-password/ForgotPassword.tsx

// src/app/(auth)/forgot-password/ForgotPassword.tsx

export function ForgotPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const isResetStep = useMemo(() => !!token, [token]);

  const router = useRouter();

  // 요청 단계
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // 재설정 단계
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const findPwMut = useFindPw();

  const pending = findPwMut.isPending;

  // --- 검증 ---
  const validateRequest = () => {
    if (!email.trim() || !username.trim()) {
      toast({
        title: "입력 필요",
        description: "이메일과 아이디를 모두 입력해주시기 바랍니다.",
      });
      return false;
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      toast({
        title: "형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
      });
      return false;
    }
    return true;
  };

  const validateReset = () => {
    if (!newPw || !newPw2) {
      toast({
        title: "입력 필요",
        description: "새 비밀번호와 확인을 모두 입력해주세요.",
      });
      return false;
    }
    if (newPw !== newPw2) {
      toast({
        title: "불일치",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
      });
      return false;
    }
    if (newPw.length < 8) {
      toast({
        title: "보안 권장",
        description: "비밀번호는 8자리 이상으로 설정해주시기 바랍니다.",
      });
    }
    return true;
  };

  // 1) 임시 비밀번호/재설정 메일 요청
  const onSubmitRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRequest()) return;

    try {
      await findPwMut.mutateAsync({
        email: email.trim(),
        username: username.trim(),
      });
      toast({
        title: "요청 완료",
        description:
          "입력하신 계정으로 비밀번호 재설정 안내를 발송했습니다. 메일함(스팸함 포함)을 확인해 주세요.",
      });
    } catch (err) {
      toast({
        title: "실패",
        description:
          e instanceof Error ? e.message : "요청 처리 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isResetStep ? "비밀번호 재설정" : "비밀번호 찾기"}
        </CardTitle>
        <CardDescription>
          {isResetStep
            ? "새 비밀번호를 설정해주시기 바랍니다."
            : "가입 시 사용하신 이메일과 아이디를 입력해 재설정 안내를 받아보세요."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={onSubmitRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">아이디</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="아이디를 입력하세요"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "요청 중..." : "재설정 안내 보내기"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                또는
              </span>
            </div>
          </div>

          <div className="text-center text-sm">
            로그인 화면으로 돌아가시겠습니까?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
