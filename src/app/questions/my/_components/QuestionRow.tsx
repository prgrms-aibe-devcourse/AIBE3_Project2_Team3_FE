"use client";

import { useRemoveQuestion } from "@/global/api/useQuestionQuery";
import { ConfirmDelete } from "@/global/components/dialog/ConfirmDeleteDialog";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { QuestionDto } from "@/global/types/question.types";
import { format } from "date-fns";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuestionRow({ data }: { data: QuestionDto }) {
  const router = useRouter();
  const removeMut = useRemoveQuestion(data.id);

  const handleDelete = async () => {
    removeMut.mutate(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <div className="w-full border rounded-xl p-4 md:p-5 bg-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/questions/${data.id}`}>
              <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary cursor-pointer">
                {data.title}
              </h3>
            </Link>
            {data.answers && data.answers.length > 0 && (
              <Badge variant="secondary">답변완료</Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              작성일:{" "}
              <span className="font-medium text-foreground">
                {format(new Date(data.createdDate), "yyyy-MM-dd")}
              </span>
            </span>
            {data.modifiedDate && (
              <span>
                수정일:{" "}
                <span className="font-medium text-foreground">
                  {format(new Date(data.modifiedDate), "yyyy-MM-dd")}
                </span>
              </span>
            )}
            <span>
              답변 수:{" "}
              <span className="font-medium text-foreground">
                {data.answers?.length || 0}개
              </span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.content}
          </p>
        </div>

        <div className="shrink-0 flex md:flex-col gap-2 self-stretch md:self-start">
          <Link href={`/questions/${data.id}`}>
            <Button variant="outline" className="w-full">
              상세보기
            </Button>
          </Link>
          <ConfirmDelete
            title="문의사항 삭제"
            description="삭제 후 복구할 수 없습니다."
            onConfirm={handleDelete}
          >
            삭제
          </ConfirmDelete>
        </div>
      </div>
    </div>
  );
}
