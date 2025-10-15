"use client";

import { Button } from "@/global/components/ui/button";

import { Check, MessageSquare, Star, X } from "lucide-react";

import { DealStatus } from "./StatusBadge";

type Props = {
  status: DealStatus;
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
  onReview?: () => void;
  loading?: boolean;
};

export function RowActions({
  status,
  onAccept,
  onReject,
  onChat,
  onReview,
  loading,
}: Props) {
  if (status === "PENDING") {
    return (
      <div className="flex gap-2">
        <Button size="sm" onClick={onAccept} disabled={loading}>
          <Check className="mr-1 h-4 w-4" /> 수락
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onReject}
          disabled={loading}
        >
          <X className="mr-1 h-4 w-4" /> 거절
        </Button>
      </div>
    );
  }
  if (status === "ACCEPTED") {
    return (
      <Button size="sm" variant="secondary" onClick={onChat}>
        <MessageSquare className="mr-1 h-4 w-4" /> 채팅
      </Button>
    );
  }
  if (status === "COMPLETED") {
    return (
      <Button size="sm" onClick={onReview}>
        <Star className="mr-1 h-4 w-4" /> 리뷰작성
      </Button>
    );
  }
  return null; // REJECTED 등
}
