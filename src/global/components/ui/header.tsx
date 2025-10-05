"use client";

import { useFetchMe, useLogout } from "@/global/api/useAuthQuery";
import { useState } from "react";

import Link from "next/link";

import { Bell, Menu, MessageCircle, User, X } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data } = useFetchMe();
  const { mutate, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-xl">TalentLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/projects"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            프로젝트 찾기
          </Link>
          <Link
            href="/freelancers"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            프리랜서 찾기
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            대시보드
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {!!data ? (
            <>
              <Button variant="ghost" size="sm" className="relative" asChild>
                <Link href="/messages">
                  <MessageCircle className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    2
                  </Badge>
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4" />
                  {data?.data?.nickname}님
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onClick={() => mutate()}
              >
                {isPending ? "로그아웃 중..." : "로그아웃"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">회원가입</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container px-4 py-4 space-y-4">
            <Link
              href="/projects"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              프로젝트 찾기
            </Link>
            <Link
              href="/freelancers"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              프리랜서 찾기
            </Link>
            <Link
              href="/dashboard"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              대시보드
            </Link>
            <Link
              href="/messages"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              메시지
            </Link>
            <div className="flex items-center space-x-2 pt-4 border-t">
              {!!data ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4" />
                      마이페이지
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent cursor-pointer"
                    onClick={() => mutate()}
                  >
                    {isPending ? "로그아웃 중..." : "로그아웃"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href="/auth/login">로그인</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/auth/signup">회원가입</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
