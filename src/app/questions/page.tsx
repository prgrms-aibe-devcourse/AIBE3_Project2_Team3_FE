"use client";

import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { ScrollArea } from "@/global/components/ui/scroll-area";
import { Separator } from "@/global/components/ui/separator";

import Link from "next/link";

import { CheckCircle2, Clock, MessageCircle, Plus } from "lucide-react";

export default function QuestionsPage() {
  // TODO: API 연동 후 실제 데이터로 교체
  const mockQuestions = [
    {
      id: 1,
      title: "프로젝트 진행 방식에 대한 문의",
      content: "프리랜서와 프로젝트를 진행할 때 어떤 방식으로...",
      author: "김개발",
      createdAt: "2024-01-15",
      status: "answered",
      answerCount: 2,
      category: "프로젝트 관리",
    },
    {
      id: 2,
      title: "결제 관련 문의사항",
      content: "결제 진행 중 오류가 발생했는데...",
      author: "이디자인",
      createdAt: "2024-01-14",
      status: "pending",
      answerCount: 0,
      category: "결제",
    },
    {
      id: 3,
      title: "프리랜서 평가 시스템은 어떻게 되나요?",
      content: "완료된 프로젝트에 대한 평가는...",
      author: "박기획",
      createdAt: "2024-01-13",
      status: "answered",
      answerCount: 1,
      category: "평가",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "answered":
        return "답변 완료";
      case "pending":
        return "답변 대기";
      default:
        return "확인 중";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "answered":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">문의사항</h1>
          <Link href="/questions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 문의 작성
            </Button>
          </Link>
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/questions/my">
            <Button variant="outline">내 문의사항</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* 통계 카드들 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 문의</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">답변 대기</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">답변 완료</p>
                <p className="text-2xl font-bold">133</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 문의사항 목록 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>최근 문의사항</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {mockQuestions.map((question) => (
                <Link
                  key={question.id}
                  href={`/questions/${question.id}`}
                  className="block hover:bg-muted/50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary">
                          {question.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {question.content}
                        </p>
                      </div>
                      <Badge
                        className={`ml-4 ${getStatusColor(question.status)}`}
                      >
                        {getStatusIcon(question.status)}
                        <span className="ml-1">
                          {getStatusText(question.status)}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>작성자: {question.author}</span>
                        <span>카테고리: {question.category}</span>
                        <span>작성일: {question.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{question.answerCount}개 답변</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
