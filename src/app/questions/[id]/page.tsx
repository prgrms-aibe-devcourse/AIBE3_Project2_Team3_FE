"use client";

import {
  useCreateAnswer,
  useModifyAnswer,
  useRemoveAnswer,
} from "@/global/api/useAnswerQuery";
import { useFetchMe } from "@/global/api/useAuthQuery";
import { useDetailQuestion } from "@/global/api/useQuestionQuery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/global/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/global/components/ui/avatar";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/global/components/ui/dropdown-menu";
import { Separator } from "@/global/components/ui/separator";
import { Textarea } from "@/global/components/ui/textarea";
import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Calendar,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = Number(params.id);
  const [newAnswer, setNewAnswer] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingAnswerId, setDeletingAnswerId] = useState<number | null>(null);

  const { data, isLoading, error } = useDetailQuestion(questionId);
  const { data: userData, isLoading: isUserLoading } = useFetchMe();
  const createAnswerMut = useCreateAnswer();

  // 편집 중인 답변 ID를 위한 mutation hooks
  const modifyAnswerMut = useModifyAnswer(editingAnswerId || 0);
  const removeAnswerMut = useRemoveAnswer(deletingAnswerId || 0);

  const isAdmin = userData?.data?.role === "관리자";

  const handleSubmitAnswer = async () => {
    if (!isAdmin || !newAnswer.trim() || !questionId) {
      return;
    }

    createAnswerMut.mutate(
      {
        questionId,
        body: { content: newAnswer.trim() },
      },
      {
        onSuccess: () => {
          setNewAnswer("");
        },
      },
    );
  };

  const handleEditAnswer = (answerId: number, currentContent: string) => {
    setEditingAnswerId(answerId);
    setEditingContent(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditingContent("");
  };

  const handleSaveEdit = async (answerId: number) => {
    if (!editingContent.trim()) return;

    modifyAnswerMut.mutate(
      { content: editingContent.trim() },
      {
        onSuccess: () => {
          handleCancelEdit();
        },
      },
    );
  };

  const handleDeleteClick = (answerId: number) => {
    setDeletingAnswerId(answerId);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingAnswerId) return;

    removeAnswerMut.mutate(undefined, {
      onSuccess: () => {
        setDeletingAnswerId(null);
      },
      onError: () => {
        setDeletingAnswerId(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setDeletingAnswerId(null);
  };

  const question = data?.data;

  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="text-red-600">
            문의사항을 불러오는데 실패했습니다.
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{question.user.nickname}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(question.createdDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            {question.content
              .split("\n")
              .map((paragraph: string, index: number) => (
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
            답변
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="max-h-[600px] overflow-y-auto">
            <div className="divide-y">
              {question.answers &&
              Array.isArray(question.answers) &&
              question.answers.length > 0 ? (
                question.answers.map((answer: any) => (
                  <div key={answer.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {answer.user?.nickname?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {answer.user?.nickname || "알 수 없음"}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(answer.createdDate).toLocaleString()}
                            </span>
                          </div>
                          {/* 관리자만 수정/삭제 가능 */}
                          {isAdmin && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleEditAnswer(
                                      answer.id,
                                      (answer as any).comment || "",
                                    )
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  수정
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(answer.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        {/* 편집 모드 */}
                        {editingAnswerId === answer.id ? (
                          <div className="space-y-3">
                            <Textarea
                              value={editingContent}
                              onChange={(e) =>
                                setEditingContent(e.target.value)
                              }
                              className="min-h-[100px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSaveEdit(answer.id)}
                                disabled={!editingContent.trim()}
                              >
                                저장
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                취소
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            {(answer as any).comment
                              ?.split("\n")
                              .map((paragraph: string, pIndex: number) => (
                                <p
                                  key={pIndex}
                                  className="mb-3 last:mb-0 whitespace-pre-wrap"
                                >
                                  {paragraph}
                                </p>
                              )) || <p>내용을 불러올 수 없습니다.</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  아직 답변이 없습니다.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 답변 작성 - ADMIN만 표시 */}
      {isAdmin ? (
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
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!newAnswer.trim() || createAnswerMut.isPending}
                >
                  {createAnswerMut.isPending ? "등록 중..." : "답변 등록"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* 삭제 확인 대화상자 */}
      <AlertDialog
        open={!!deletingAnswerId}
        onOpenChange={() => setDeletingAnswerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>답변 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 답변을 삭제하시겠습니까? 삭제된 답변은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
