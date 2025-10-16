"use client";

import { useJoin } from "@/global/api/useAuthQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Checkbox } from "@/global/components/ui/checkbox";
import { Input } from "@/global/components/ui/input";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { Label } from "@radix-ui/react-label";
import type React from "react";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Contact, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate, isPending } = useJoin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "");
    const password = String(fd.get("password") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");
    const nickname = String(fd.get("nickname") || "");
    const email = String(fd.get("email") || "");
    if (password !== confirmPassword) {
      return toast({
        title: "실패",
        description: "비밀번호가 일치하지 않습니다.",
      });
    }

    mutate(
      { username, password, nickname, email },
      {
        onSuccess: (res) => {
          toast({
            title: "성공",
            description: res.message,
          });
          router.replace(`/auth/login`);
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>
          JOB+PICK에 가입하여 새로운 기회를 만나보세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">아이디</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="아이디를 입력하세요"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="8자 이상 입력하세요"
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                className="pl-10 pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {!showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <div className="relative">
              <Contact className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="홍길동"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <Label htmlFor="terms" className="text-sm">
              <div>회원 가입 및 이용에 동의합니다.</div>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "가입 중..." : "회원가입"}
          </Button>
        </form>

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
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
