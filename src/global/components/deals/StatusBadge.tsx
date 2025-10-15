"use client";

import { Badge } from "@/global/components/ui/badge";

export type DealStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export function StatusBadge({ status }: { status: DealStatus }) {
  const map: Record<DealStatus, string> = {
    PENDING: "대기",
    ACCEPTED: "수락",
    REJECTED: "거절",
    COMPLETED: "완료",
  };
  const variant: Record<DealStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    COMPLETED: "bg-slate-100 text-slate-800",
  };
  return <Badge className={variant[status]}>{map[status]}</Badge>;
}
