"use client";

import { Button } from "@/global/components/ui/button";
import { Checkbox } from "@/global/components/ui/checkbox";
import { Input } from "@/global/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/global/components/ui/popover";
import { cn } from "@/global/lib/utils";
import { useMemo, useState } from "react";

import { ChevronsUpDown, Search } from "lucide-react";

export type Option = { id: number; name: string };

type MultiSelectProps = {
  value: number[];
  onChange: (next: number[]) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "선택",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? options.filter((o) => o.name.toLowerCase().includes(s))
      : options;
  }, [q, options]);

  const toggle = (id: number) => {
    const set = new Set(value);
    set.has(id) ? set.delete(id) : set.add(id);
    onChange(Array.from(set));
  };

  const selectedCount = value.length;
  const buttonLabel =
    selectedCount > 0 ? `${placeholder} (${selectedCount})` : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate text-left">{buttonLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
        <div className="relative mb-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="스킬 검색..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="max-h-72 overflow-y-auto space-y-1">
          {filtered.map((o) => {
            const on = value.includes(o.id);
            return (
              <label
                key={o.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/70"
              >
                <Checkbox checked={on} onCheckedChange={() => toggle(o.id)} />
                <span className="text-sm">{o.name}</span>
              </label>
            );
          })}
          {!filtered.length && (
            <div className="text-sm text-muted-foreground px-2 py-4">
              결과가 없습니다.
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => onChange([])}>
            초기화
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            확인
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
