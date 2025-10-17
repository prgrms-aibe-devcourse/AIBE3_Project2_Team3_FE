"use client";

import { useListQuestion } from "@/global/api/useQuestionQuery";
import { Button } from "@/global/components/ui/button";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { QuestionDto } from "@/global/types/question.types";
import { useMemo, useState } from "react";

import Link from "next/link";

import { MessageCircle, Plus } from "lucide-react";

export default function QuestionsPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  const { data, isLoading, error } = useListQuestion({
    page: currentPage,
    size: pageSize,
    sort: ["createdDate,desc"],
  });

  const questions = useMemo((): QuestionDto[] => {
    return data?.content || [];
  }, [data]);

  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">문의사항</h1>
              <p className="text-muted-foreground">
                궁금한 점이 있으시면 언제든지 문의해주세요
              </p>
            </div>
            <Link href="/questions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />새 문의 작성
              </Button>
            </Link>
          </div>

          <div className="flex justify-end">
            <Link href="/questions/my">
              <Button variant="outline">내 문의사항</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">로딩 중...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600">
                데이터를 불러오는데 실패했습니다.
              </div>
            </div>
          )}

          {!isLoading && !error && questions.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <div className="text-muted-foreground">
                등록된 문의사항이 없습니다.
              </div>
            </div>
          )}

          {!isLoading && !error && questions.length > 0 && (
            <>
              <div className="grid gap-4">
                {questions.map((question) => (
                  <Link
                    key={question.id}
                    href={`/questions/${question.id}`}
                    className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary">
                      {question.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 mb-3">
                      {question.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>작성자: {question.user.nickname}</span>
                      <span>
                        작성일:{" "}
                        {new Date(question.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {data && data.page.totalPages > 1 && (
                <div className="flex justify-center pt-8">
                  <PaginationBar
                    pageIndex={currentPage}
                    pageCount={data.page.totalPages}
                    onPageIndexChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
