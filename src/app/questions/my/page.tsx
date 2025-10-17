"use client";

import { useListMyQuestions } from "@/global/api/useQuestionQuery";
import { Card } from "@/global/components/ui/card";
import { QuestionDto } from "@/global/types/question.types";
import { useMemo } from "react";

import QuestionRow from "./_components/QuestionRow";

export default function MyQuestionsPage() {
  const { data, status, isFetching } = useListMyQuestions();

  const items = useMemo((): QuestionDto[] => data?.content ?? [], [data]);

  return (
    <main className="w-full py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">내 문의사항</h1>

      <div className="flex flex-col gap-4">
        {status === "pending" &&
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="h-36 animate-pulse" />
          ))}

        {status === "success" && items.length === 0 && (
          <div className="rounded-xl border p-10 text-center text-muted-foreground">
            작성한 문의사항이 없습니다.
          </div>
        )}

        {items.map((item) => (
          <QuestionRow key={item.id} data={item} />
        ))}
      </div>

      {isFetching && (
        <div className="text-center text-sm text-muted-foreground py-2">
          불러오는 중…
        </div>
      )}
    </main>
  );
}
