import { cn } from "@/global/lib/utils";
import { useEffect } from "react";

import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type Unit = string;

type UnitOption<T extends string = string> = { value: T; label: string };

type DurationValue = { amount: number; unit: Unit };

type Props = {
  value: DurationValue;
  onChange: (next: DurationValue) => void;

  // 🔽 동적 유닛 옵션 + 기본 유닛
  unitOptions: UnitOption[];
  defaultUnit: Unit;

  min?: number;
  max?: number;
  step?: number;
  allowZero?: boolean;

  placeholder?: string;
  inputClassName?: string;
  selectClassName?: string;

  disabled?: boolean;
  required?: boolean;
};

export function UnitInput({
  value,
  onChange,
  unitOptions, // 🔹단위
  defaultUnit, // 🔹기본 선택값
  min = 1,
  max,
  step = 1,
  allowZero = false,
  placeholder = "기간을 입력하세요",
  inputClassName,
  selectClassName,
  disabled,
  required,
}: Props) {
  // 옵션 리스트가 바뀌거나, value.unit이 옵션에 없으면 안전하게 보정
  useEffect(() => {
    const exists = unitOptions.some((o) => o.value === value.unit);
    if (!exists) {
      const fallback =
        unitOptions.find((o) => o.value === defaultUnit)?.value ??
        unitOptions[0]?.value ??
        value.unit; // 옵션이 비어있을 일은 거의 없지만 방어
      if (fallback !== value.unit) onChange({ ...value, unit: fallback });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitOptions]);

  const handleAmount = (raw: string) => {
    if (raw === "") {
      onChange({ ...value, amount: allowZero ? 0 : min });
      return;
    }
    let n = Math.trunc(Number(raw.replace(/[^\d.-]/g, "")));
    if (Number.isNaN(n)) return;
    const _min = allowZero ? 0 : min;
    if (typeof max === "number") n = Math.min(max, n);
    n = Math.max(_min, n);
    onChange({ ...value, amount: n });
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="number"
        inputMode="numeric"
        min={allowZero ? 0 : min}
        max={max}
        step={step}
        value={Number.isFinite(value.amount) ? value.amount : ""}
        onChange={(e) => handleAmount(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={cn("flex-1 px-4 py-3 rounded-lg", inputClassName)}
      />

      <Select
        // 🔹기본값: defaultUnit. 단, value.unit이 옵션에 없으면 useEffect에서 보정됨
        value={value.unit}
        onValueChange={(v) => onChange({ ...value, unit: v })}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn("px-4 py-3 pr-2 rounded-lg", selectClassName)}
        >
          <SelectValue placeholder="단위" />
        </SelectTrigger>
        <SelectContent className="min-w-[8rem]">
          {unitOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
