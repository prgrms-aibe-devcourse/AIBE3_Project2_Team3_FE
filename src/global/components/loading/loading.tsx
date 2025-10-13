"use client";

import { cn } from "@/global/lib/utils";
import * as React from "react";

import { Loader2 } from "lucide-react";

type Props = {
  message?: string;
  showBackdrop?: boolean; // 페이지 전체 덮는 반투명 배경
  progress?: number; // 0~100 (선택)
  tips?: string[]; // 랜덤/순차 안내 문구
  className?: string;
};

export default function LoadingScreen({
  message = "로딩 중...",
  showBackdrop = true,
  progress,
  tips,
  className,
}: Props) {
  const tip = React.useMemo(
    () => (tips && tips.length ? tips[0] : null),
    [tips],
  );

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className={cn(
        "relative flex h-dvh w-full items-center justify-center",
        showBackdrop && "bg-background/60 backdrop-blur-sm",
        className,
      )}
    >
      {/* 카드 */}
      <div
        className={cn(
          "flex min-w-[220px] max-w-[90vw] flex-col items-center gap-3",
          "rounded-2xl border bg-background p-6 shadow-sm",
        )}
      >
        {/* 스피너 (모션 축소 환경 지원) */}
        <Loader2
          className="h-6 w-6 animate-spin motion-reduce:animate-none text-primary"
          aria-hidden="true"
        />

        {/* 메세지 */}
        <p className="text-sm text-muted-foreground">{message}</p>

        {/* 프로그레스 바 (옵션) */}
        {typeof progress === "number" && (
          <div className="w-56">
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-[width]"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {Math.round(progress)}%
            </div>
          </div>
        )}

        {/* 팁 (옵션) */}
        {tip && <p className="text-xs text-muted-foreground/80">{tip}</p>}
      </div>
    </div>
  );
}
