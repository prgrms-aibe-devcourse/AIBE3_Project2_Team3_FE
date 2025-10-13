"use client";

import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";

import Link from "next/link";

import {
  FilePlus2,
  FileSearch,
  Plus,
  UserRoundPlus,
  UserSearch,
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "프로젝트 찾기",
      description: "맞춤 프로젝트 검색",
      icon: <FileSearch className="h-5 w-5" />,
      href: "/projects",
      variant: "outline" as const,
    },
    {
      title: "프로젝트 공고 작성",
      description: "맞춤 프로젝트 검색",
      icon: <FilePlus2 className="h-5 w-5" />,
      href: "/projects/new",
      variant: "outline" as const,
    },
    {
      title: "프리랜서 찾기",
      description: "맞춤 프리랜서 검색",
      icon: <UserSearch className="h-5 w-5" />,
      href: "/freelancers",
      variant: "outline" as const,
    },
    {
      title: "프리랜서 게시글 작성",
      description: "맞춤 프로젝트 검색",
      icon: <UserRoundPlus className="h-5 w-5" />,
      href: "/freelancers/new",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>빠른 작업</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="w-full justify-start h-auto p-4"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center space-x-3">
                {action.icon}
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
