"use client";

import { Button } from "@/global/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/global/components/ui/dialog";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { useState } from "react";

export function AddDialog({
  triggerText = "+ 추가",
  title = "새 항목 추가",
  placeholder = "이름",
  onConfirm,
}: {
  triggerText?: string;
  title?: string;
  placeholder?: string;
  onConfirm: (name: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const submit = async () => {
    if (!name.trim()) return;
    await onConfirm(name.trim());
    setName("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label>이름</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={placeholder}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button onClick={submit}>추가</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
