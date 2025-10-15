"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/global/components/ui/alert-dialog";
import { Button } from "@/global/components/ui/button";
import { useState } from "react";

type ConfirmDeleteProps = {
  onConfirm: () => Promise<void> | void;
  /** 트리거 버튼 라벨 (기본: '삭제') */
  children?: React.ReactNode;
  /** 다이얼로그 타이틀 */
  title?: string;
  /** 서브 텍스트 */
  description?: string;
  /** 버튼 사이즈/variant 커스터마이즈 (선택) */
  triggerSize?: React.ComponentProps<typeof Button>["size"];
  triggerVariant?: React.ComponentProps<typeof Button>["variant"];
};

export function ConfirmDelete({
  onConfirm,
  children = "삭제",
  title = "정말 삭제하시겠습니까?",
  description,
  triggerSize = "sm",
  triggerVariant = "destructive",
}: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const confirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={triggerSize}
          variant={triggerVariant}
          disabled={submitting}
        >
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel disabled={submitting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={confirm} disabled={submitting}>
            {submitting ? `${children} 중...` : `${children}`}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
