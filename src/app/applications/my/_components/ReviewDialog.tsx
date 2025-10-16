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
import { useEffect, useMemo, useState } from "react";

import { Star } from "lucide-react";

type Props = {
  postId: number;
  trigger?: React.ReactNode;
  postTitle?: string;
  onSubmitted?: () => void;
  initialHasMyReview?: boolean;
};

export default function ReviewCreateDialog({
  postId,
  postTitle,
  trigger,
  onSubmitted,
  initialHasMyReview = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [hasMyReview, setHasMyReview] = useState(initialHasMyReview);

  const createMut = useCreateReview(postId);
  const submitting = createMut.isPending;

  const canSubmit = rating >= 1 && comment.trim().length >= 5;
  const label = useMemo(
    () => (hasMyReview ? "리뷰 수정" : "리뷰 작성"),
    [hasMyReview],
  );

  const submit = async () => {
    if (!canSubmit) return;
    await createMut.mutateAsync({ rating, comment: comment.trim() });
    setHasMyReview(true);
    setOpen(false);
    setComment("");
    setRating(5);
    onSubmitted?.();
  };

  useEffect(() => {
    if (!open) {
      setComment("");
      setRating(5);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" variant="outline">
            {label}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>
            {postTitle ? `게시글: ${postTitle}` : `게시글 ID: ${postId}`}
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
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={6}
            placeholder="최소 5자 이상 작성해 주세요"
          />
          <div className="text-xs text-muted-foreground">
            {comment.length}자 / 최소 5자
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            취소
          </Button>
          <Button onClick={submit} disabled={!canSubmit || submitting}>
            {submitting ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
