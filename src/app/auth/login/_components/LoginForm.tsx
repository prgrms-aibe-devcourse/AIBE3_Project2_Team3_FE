"use client";

import { useLogin } from "@/global/api/useAuthQuery";
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
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Eye, EyeOff, Lock, User } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("username") || "");
    const password = String(fd.get("password") || "");
    mutate(
      { username, password },
      {
        onSuccess: () => {
          router.replace(`/`);
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
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          계정에 로그인하여 TalentLink를 시작하세요
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
                placeholder="비밀번호를 입력하세요"
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

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "로그인 중..." : "로그인"}
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

        <div className="space-y-3">
          <Button variant="outline" className="w-full bg-transparent">
            Google로 계속하기
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            GitHub으로 계속하기
          </Button>
        </div>

        <div className="text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
