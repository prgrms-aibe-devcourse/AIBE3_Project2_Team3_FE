"use client";

import { useProjectReviews } from "@/global/api/useReviewQuery";
import { Button } from "@/global/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/global/components/ui/dialog";
import { ScrollArea } from "@/global/components/ui/scroll-area";
import { Separator } from "@/global/components/ui/separator";
import type { ReviewDto } from "@/global/types/review.types";
import { useMemo, useState } from "react";

import { Loader2, Star } from "lucide-react";

export default function ReviewListDialog({
  projectId,
  trigger,
  pageSize = 10,
  sort = "id,ASC",
}: {
  projectId: number | string;
  trigger?: React.ReactNode;
  pageSize?: number;
  sort?: string | string[];
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  const query = useProjectReviews(
    Number(projectId),
    { page, size: pageSize, sort },
    open,
  );

  const list: ReviewDto[] = query.data?.content ?? [];
  const pageInfo = query.data?.page;

  const title = useMemo(() => `프로젝트 #${projectId} 리뷰`, [projectId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="secondary">
            리뷰 확인
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            이 프로젝트에 등록된 리뷰를 확인하실 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[180px]">
          {query.isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              불러오는 중입니다…
            </div>
          ) : query.isError ? (
            <div className="text-sm text-destructive">
              {(query.error as Error)?.message ?? "오류가 발생했습니다."}
            </div>
          ) : list.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              등록된 리뷰가 없습니다.
            </div>
          ) : (
            <ScrollArea className="max-h-[420px] pr-3">
              <div className="space-y-4">
                {list.map((rv) => (
                  <div key={rv.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        작성자: {rv.userNickname} · 대상: {rv.targetNickname}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`h-4 w-4 ${n <= rv.rating ? "fill-current" : ""}`}
                          />
                        ))}
                        <span className="ml-1">({rv.rating}/5)</span>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap break-words">
                      {rv.comment}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      작성일:{" "}
                      {rv.createdAt
                        ? new Date(rv.createdAt).toLocaleString()
                        : "-"}
                    </div>

                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="justify-between">
          {pageInfo && pageInfo.totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                이전
              </Button>
              <span className="text-sm text-muted-foreground">
                {page + 1} / {pageInfo.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page + 1 >= pageInfo.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          ) : (
            <span />
          )}

          <Button variant="default" onClick={() => setOpen(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
