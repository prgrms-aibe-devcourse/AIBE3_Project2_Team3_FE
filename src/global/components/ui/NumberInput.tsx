import { cn } from "@/global/lib/utils";

import { Input } from "./input";

type Unit = string;

type DurationValue = { amount: number; unit: Unit };

type Props = {
  value: DurationValue;
  onChange: (next: DurationValue) => void;

  min?: number;
  max?: number;
  step?: number;
  allowZero?: boolean;

  placeholder?: string;
  inputClassName?: string;

  disabled?: boolean;
  required?: boolean;
};
export function NumberInput({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  allowZero = false,
  placeholder = "기간을 입력하세요",
  inputClassName,
  disabled,
  required,
}: Props) {
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
  );
}
