"use client";

import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { ScrollArea } from "@/global/components/ui/scroll-area";
import { Separator } from "@/global/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/global/components/ui/tabs";
import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";

export default function MyQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: API 연동 후 실제 데이터로 교체
  const mockMyQuestions = [
    {
      id: 1,
      title: "프로젝트 진행 방식에 대한 문의",
      content: "프리랜서와 프로젝트를 진행할 때 어떤 방식으로...",
      createdAt: "2024-01-15",
      status: "answered",
      answerCount: 2,
      category: "프로젝트 관리",
    },
    {
      id: 4,
      title: "포트폴리오 작성 가이드가 있나요?",
      content: "효과적인 포트폴리오 작성 방법에 대해...",
      createdAt: "2024-01-12",
      status: "pending",
      answerCount: 0,
      category: "포트폴리오",
    },
    {
      id: 7,
      title: "프리랜서 등록 후 프로필 수정이 안돼요",
      content: "프로필을 수정하려고 하는데 저장이 안됩니다...",
      createdAt: "2024-01-10",
      status: "answered",
      answerCount: 1,
      category: "기술지원",
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

  const answeredQuestions = mockMyQuestions.filter(
    (q) => q.status === "answered",
  );
  const pendingQuestions = mockMyQuestions.filter(
    (q) => q.status === "pending",
  );

  const renderQuestionList = (questions: typeof mockMyQuestions) => (
    <div className="divide-y">
      {questions.map((question) => (
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
              <Badge className={`ml-4 ${getStatusColor(question.status)}`}>
                {getStatusIcon(question.status)}
                <span className="ml-1">{getStatusText(question.status)}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
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
      {questions.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>문의사항이 없습니다.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* 헤더 */}
      <div className="mb-8">
        <Link href="/questions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            전체 문의로 돌아가기
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">내 문의사항</h1>
          <Link href="/questions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 문의 작성
            </Button>
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="내 문의사항을 검색하세요..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">전체 문의</p>
                <p className="text-2xl font-bold">{mockMyQuestions.length}</p>
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
                <p className="text-2xl font-bold">{pendingQuestions.length}</p>
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
                <p className="text-2xl font-bold">{answeredQuestions.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭별 문의사항 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>문의사항 목록</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  전체 ({mockMyQuestions.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  답변 대기 ({pendingQuestions.length})
                </TabsTrigger>
                <TabsTrigger value="answered">
                  답변 완료 ({answeredQuestions.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <ScrollArea className="h-[600px]">
                {renderQuestionList(mockMyQuestions)}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <ScrollArea className="h-[600px]">
                {renderQuestionList(pendingQuestions)}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="answered" className="mt-0">
              <ScrollArea className="h-[600px]">
                {renderQuestionList(answeredQuestions)}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
