"use client";

import { useListQuestion } from "@/global/api/useQuestionQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { Separator } from "@/global/components/ui/separator";
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

  const questions = useMemo(() => {
    return data?.content || [];
  }, [data]);

  const totalPages = data?.page?.totalPages || 0;

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

      {/* 문의사항 목록 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>최근 문의사항</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <div className="min-h-[400px]">
            <div className="divide-y">
              {isLoading && (
                <div className="p-12 text-center text-muted-foreground">
                  <div className="text-sm">로딩 중...</div>
                </div>
              )}

              {error && (
                <div className="p-12 text-center text-red-600">
                  <div className="text-sm">
                    데이터를 불러오는데 실패했습니다.
                  </div>
                </div>
              )}

              {!isLoading && !error && questions.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div className="text-sm">등록된 문의사항이 없습니다.</div>
                </div>
              )}

              {!isLoading &&
                !error &&
                questions.map((question) => (
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
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>작성자: {question.user.nickname}</span>
                          <span>
                            작성일:{" "}
                            {new Date(
                              question.createdDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* 페이지네이션 */}
          <div className="text-center pt-8">
            {data && (
              <PaginationBar
                pageIndex={currentPage}
                pageCount={data.page.totalPages}
                onPageIndexChange={setCurrentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
