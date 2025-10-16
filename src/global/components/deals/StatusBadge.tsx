"use client";

import { Badge } from "@/global/components/ui/badge";
import { DEAL_STATUS_MAP } from "@/global/consts";

export type DealStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export function StatusBadge({ status }: { status: DealStatus }) {
  const variant: Record<DealStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    COMPLETED: "bg-slate-100 text-slate-800",
  };
  return <Badge className={variant[status]}>{DEAL_STATUS_MAP[status]}</Badge>;
}
