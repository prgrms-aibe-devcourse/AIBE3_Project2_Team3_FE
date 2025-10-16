"use client";

import { Avatar, AvatarFallback } from "@/global/components/ui/avatar";
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
import { Textarea } from "@/global/components/ui/textarea";
import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MessageCircle,
  Tag,
  User,
} from "lucide-react";

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id;
  const [newAnswer, setNewAnswer] = useState("");

  // TODO: API 연동 후 실제 데이터로 교체
  const mockQuestion = {
    id: 1,
    title: "프로젝트 진행 방식에 대한 문의",
    content: `프리랜서와 프로젝트를 진행할 때 어떤 방식으로 소통하고 일정을 관리하는 것이 좋을까요?
    
현재 웹 개발 프로젝트를 진행 중인데, 프리랜서와의 원활한 소통과 프로젝트 관리에 대해 조언을 구합니다.

특히 다음과 같은 부분이 궁금합니다:
1. 진행 상황 공유는 어떤 주기로 하는 것이 좋은가요?
2. 중간 검토는 언제 어떻게 진행하나요?
3. 수정 요청이 있을 때는 어떻게 처리하나요?

경험 있으신 분들의 조언 부탁드립니다.`,
    author: "김개발",
    authorId: "dev_kim",
    createdAt: "2024-01-15T10:30:00",
    status: "answered",
    category: "프로젝트 관리",
    answers: [
      {
        id: 1,
        content: `안녕하세요! 프리랜서로 3년째 일하고 있는 개발자입니다.

제 경험으로는 다음과 같이 진행하는 것이 좋습니다:

**1. 진행 상황 공유**
- 주 2-3회 정기적으로 진행 상황을 공유합니다
- 슬랙이나 노션 등을 활용해서 실시간으로 확인할 수 있도록 합니다

**2. 중간 검토**
- 전체 일정의 30%, 60%, 90% 지점에서 검토 미팅을 진행합니다
- 각 단계별로 명확한 deliverable을 정의해두는 것이 중요합니다

**3. 수정 요청 처리**
- 사전에 수정 횟수와 범위를 계약서에 명시해두세요
- 추가 수정이 필요한 경우의 비용과 일정도 미리 협의하는 것이 좋습니다

도움이 되셨기를 바랍니다!`,
        author: "이프리",
        authorId: "freelancer_lee",
        createdAt: "2024-01-15T14:20:00",
        isAdmin: false,
      },
      {
        id: 2,
        content: `좋은 질문이네요! 운영진 관점에서도 몇 가지 추가로 말씀드리겠습니다.

**플랫폼 내 기능 활용**
- 프로젝트 관리 도구를 적극 활용해주세요
- 마일스톤 기능으로 단계별 목표를 설정할 수 있습니다
- 파일 공유와 피드백 기능도 유용합니다

**분쟁 방지**
- 모든 중요한 결정사항은 플랫폼 내 메시지로 기록해주세요
- 범위 변경이나 추가 요구사항이 생기면 반드시 협의 후 진행하세요

추가 궁금한 점이 있으시면 언제든 문의해주세요!`,
        author: "운영진",
        authorId: "admin",
        createdAt: "2024-01-16T09:15:00",
        isAdmin: true,
      },
    ],
  };

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

  const handleSubmitAnswer = () => {
    // TODO: API 연동
    console.log("새 답변:", newAnswer);
    setNewAnswer("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Link href="/questions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </Link>
      </div>

      {/* 질문 상세 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-4">{mockQuestion.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{mockQuestion.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(mockQuestion.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{mockQuestion.category}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(mockQuestion.status)}`}>
              {getStatusIcon(mockQuestion.status)}
              <span className="ml-1">{getStatusText(mockQuestion.status)}</span>
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            {mockQuestion.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 답변 목록 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            답변 ({mockQuestion.answers.length}개)
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <ScrollArea className="max-h-[600px]">
            <div className="divide-y">
              {mockQuestion.answers.map((answer, index) => (
                <div key={answer.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{answer.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold">{answer.author}</span>
                        {answer.isAdmin && (
                          <Badge variant="destructive" className="text-xs">
                            운영진
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(answer.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        {answer.content.split("\n").map((paragraph, pIndex) => (
                          <p
                            key={pIndex}
                            className="mb-3 last:mb-0 whitespace-pre-wrap"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 답변 작성 */}
      <Card>
        <CardHeader>
          <CardTitle>답변 작성</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="답변을 작성해주세요..."
              className="min-h-[120px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
                답변 등록
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
