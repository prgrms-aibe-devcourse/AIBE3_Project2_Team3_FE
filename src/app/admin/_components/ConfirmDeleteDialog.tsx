"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/global/components/ui/alert-dialog";
import { Button } from "@/global/components/ui/button";
import { useState } from "react";

export function ConfirmDelete({
  onConfirm,
  children = "삭제",
}: {
  onConfirm: () => Promise<void> | void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const confirm = async () => {
    await onConfirm();
    setOpen(false);
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>삭제</AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
