"use client";

import { useCreateReview } from "@/global/api/useReviewQuery";
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
import { Textarea } from "@/global/components/ui/textarea";
import type {
  ReviewDialogProps,
  ReviewReqBody,
} from "@/global/types/review.types";
import { useState } from "react";

import { Star } from "lucide-react";

export default function ReviewDialog({
  app,
  trigger,
  onSubmitted,
}: ReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");

  const createMut = useCreateReview(Number(app.postId));

  const canSubmit = rating >= 1 && content.trim().length >= 5;

  const submit = async () => {
    if (!canSubmit || createMut.isPending) return;
    try {
      await createMut.mutateAsync({
        rating,
        comment: content.trim(),
      } as ReviewReqBody);
      setOpen(false);
      setContent("");
      setRating(5);
      onSubmitted?.();
    } catch (e) {
      console.error(e);
      alert(
        e instanceof Error
          ? e.message
          : "리뷰 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">리뷰 작성</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>리뷰 작성</DialogTitle>
          <DialogDescription>
            대상: {app?.userNickname ?? "사용자"} · 게시글 ID: {app.postId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-sm font-medium">평점</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n}점`}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star
                  className={`w-6 h-6 ${n <= rating ? "fill-current" : ""}`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating} / 5
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">내용</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="최소 5자 이상 작성해 주세요"
          />
          <div className="text-xs text-muted-foreground">
            {content.length}자 / 최소 5자
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createMut.isPending}
          >
            취소
          </Button>
          <Button onClick={submit} disabled={!canSubmit || createMut.isPending}>
            {createMut.isPending ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
