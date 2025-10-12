"use client";

import { cn } from "@/global/lib/utils";
import * as React from "react";

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number; // 기본 1
  max?: number; // 옵션(없으면 무제한)
  step?: number; // 기본 1
  className?: string;
  disabled?: boolean;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  className,
  disabled,
}: Props) {
  const clamp = (n: number) => {
    if (max != null) return Math.min(Math.max(n, min), max);
    return Math.max(n, min);
  };

  const dec = () => !disabled && onChange(clamp(value - step));
  const inc = () => !disabled && onChange(clamp(value + step));

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    if (Number.isNaN(n)) return;
    onChange(clamp(n));
  };

  const canDec = !disabled && value > min;
  const canInc = !disabled && (max == null || value < max);

  return (
    <div
      className={cn(
        "inline-flex h-8 items-center gap-1", // 더 낮고 컴팩트
        className,
      )}
      role="group"
      aria-label="수량 선택"
    >
      {/* 버튼에만 배경 */}
      <button
        type="button"
        onClick={dec}
        disabled={!canDec}
        aria-label="수량 감소"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md",
          "bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50",
        )}
      >
        –
      </button>

      {/* 더 작은 입력창 (4자리 기준) */}
      <input
        type="text" // 직접 제어 위해 text 사용
        inputMode="numeric" // 모바일 숫자 키패드
        autoComplete="off"
        value={String(value)}
        onChange={onInputChange}
        className={cn(
          // 폭·높이 축소, 가운데 정렬
          "h-8 w-12 text-center text-sm", // 4자리면 w-12~w-14가 적당
          "rounded-md border bg-background",
          "outline-none focus:ring-2 focus:ring-ring/30",
        )}
        aria-live="polite"
      />

      <button
        type="button"
        onClick={inc}
        disabled={!canInc}
        aria-label="수량 증가"
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md",
          "bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50",
        )}
      >
        +
      </button>
    </div>
  );
}
