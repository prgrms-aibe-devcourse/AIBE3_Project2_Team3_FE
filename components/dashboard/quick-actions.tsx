"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, MessageCircle, FileText, Settings } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "새 프로젝트 찾기",
      description: "맞춤 프로젝트 검색",
      icon: <Search className="h-5 w-5" />,
      href: "/projects",
      variant: "default" as const,
    },
    {
      title: "프로필 업데이트",
      description: "경쟁력 향상하기",
      icon: <Settings className="h-5 w-5" />,
      href: "/profile",
      variant: "outline" as const,
    },
    {
      title: "메시지 확인",
      description: "새로운 대화 시작",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/messages",
      variant: "outline" as const,
    },
    {
      title: "리뷰 작성",
      description: "완료된 프로젝트 평가",
      icon: <FileText className="h-5 w-5" />,
      href: "/reviews/write",
      variant: "outline" as const,
    },
  ]

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
          <Button key={index} variant={action.variant} className="w-full justify-start h-auto p-4" asChild>
            <Link href={action.href}>
              <div className="flex items-center space-x-3">
                {action.icon}
                <div className="text-left">
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
