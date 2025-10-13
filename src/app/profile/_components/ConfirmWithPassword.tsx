"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/global/components/ui/alert-dialog";
import { Button } from "@/global/components/ui/button";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { useState } from "react";

type Props = {
  title?: string;
  description?: string;
  triggerText?: string; // 버튼 라벨 (기본: 삭제/탈퇴 등)
  confirmText?: string; // 확인 버튼 라벨
  loadingText?: string; // 진행중 라벨
  onConfirm: (password: string) => Promise<void> | void;
};

export function ConfirmWithPassword({
  title = "확인",
  description,
  triggerText = "확인",
  confirmText = "확인",
  loadingText = "처리중...",
  onConfirm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!pw.trim()) {
      setError("비밀번호를 입력하세요.");
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await onConfirm(pw);
      setOpen(false);
      setPw("");
    } catch (e: any) {
      // 서버 에러 메시지 있으면 노출
      setError(e?.message ?? "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !submitting && setOpen(o)}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{triggerText}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {!!description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <div className="space-y-2 pt-2">
          <Label htmlFor="pw">비밀번호</Label>
          <Input
            id="pw"
            type="password"
            placeholder="현재 비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={submitting}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={submitting}>
            {submitting ? loadingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
