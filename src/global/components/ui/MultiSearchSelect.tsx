"use client";

import { cn } from "@/global/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { Search, X } from "lucide-react";

import { Badge } from "./badge";
import { Input } from "./input";

export type Item = { id: number; name: string };

type Props = {
  options: Item[]; // 전체 목록
  value: number[]; // 선택된 id 목록
  onChange: (ids: number[]) => void;
  placeholder?: string;
  allowCreate?: boolean; // 자유 입력 허용 (기본 true)
  onCreate?: (name: string) => Promise<Item>; // 자유 입력 생성 훅(서버 호출 등)
  maxSelected?: number;
  className?: string;
};

export function MultiSearchSelect({
  options,
  value,
  onChange,
  placeholder = "검색하거나 직접 입력하세요",
  allowCreate = true,
  onCreate,
  maxSelected,
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [localOptions, setLocalOptions] = useState<Item[]>(options);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // options 변경 시 동기화
  useEffect(() => setLocalOptions(options), [options]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const norm = (s: string) => s.trim().toLowerCase();

  const idSet = useMemo(() => new Set(value), [value]);
  const nameMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const o of localOptions) m.set(o.id, o.name);
    return m;
  }, [localOptions]);

  // 중복 방지: 이미 선택된 id 제외
  const filtered = useMemo(() => {
    const q = norm(query);
    return localOptions
      .filter((o) => !idSet.has(o.id))
      .filter((o) => (q ? norm(o.name).includes(q) : true))
      .slice(0, 50);
  }, [localOptions, idSet, query]);

  const atLimit =
    typeof maxSelected === "number" && value.length >= maxSelected;

  const addById = (id: number) => {
    if (atLimit || idSet.has(id)) return;
    onChange([...value, id]);
    setQuery("");
    setHighlight(0);
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const removeById = (id: number) => {
    onChange(value.filter((v) => v !== id));
    setOpen(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleEnter = async () => {
    // 제안 선택 우선
    if (open && filtered.length > 0) {
      addById(
        filtered[Math.max(0, Math.min(highlight, filtered.length - 1))].id,
      );
      return;
    }
    // 자유 입력 생성
    const text = query.trim();
    if (!text || !allowCreate) return;
    // 이미 같은 이름 option이 있고 미선택이면 그걸 선택
    const existing = localOptions.find((o) => norm(o.name) === norm(text));
    if (existing) {
      addById(existing.id);
      return;
    }
    // 새로 만들기: onCreate가 있으면 사용(서버), 없으면 로컬 임시 ID 생성
    let created: Item;
    if (onCreate) {
      created = await onCreate(text);
    } else {
      created = { id: genTempId(), name: text }; // 임시 ID(음수 등) 생성
    }
    setLocalOptions((prev) => [...prev, created]);
    addById(created.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && query.length === 0 && value.length > 0) {
      e.preventDefault();
      removeById(value[value.length - 1]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      void handleEnter();
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  };

  useEffect(() => setHighlight(0), [query]);

  return (
    <div ref={wrapperRef} className={cn("space-y-3", className)}>
      {/* 선택된 칩 */}
      <div className="flex flex-wrap gap-2">
        {value.map((id) => (
          <Badge
            key={id}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-blue-100 text-blue-800"
            title={nameMap.get(id) ?? `#${id}`}
          >
            {nameMap.get(id) ?? `#${id}`}
            <button
              type="button"
              className="ml-2 inline-flex h-4 w-4 items-center justify-center text-blue-600 hover:text-blue-800"
              aria-label="제거"
              onClick={() => removeById(id)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      {/* 입력 + 제안 */}
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => {
              if (document.activeElement === inputRef.current) {
                setOpen((o) => !o);
              }
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="pl-4 pr-10 py-3 rounded-lg"
            aria-expanded={open}
            aria-controls="items-suggestions"
          />
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {open && (filtered.length > 0 || (allowCreate && query.trim())) && (
          <div
            id="items-suggestions"
            role="listbox"
            className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white shadow-md"
          >
            {filtered.map((opt, i) => (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => addById(opt.id)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                  i === highlight
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/60",
                )}
                disabled={atLimit}
              >
                <span className="truncate">{opt.name}</span>
              </button>
            ))}

            {/* 생성 옵션 */}
            {allowCreate &&
              query.trim() &&
              !localOptions.some((o) => norm(o.name) === norm(query)) && (
                <>
                  {filtered.length > 0 && (
                    <div className="mx-2 my-1 h-px bg-border" />
                  )}
                  <button
                    type="button"
                    onClick={() => void handleEnter()}
                    className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-accent/60"
                    disabled={atLimit}
                  >
                    “{query.trim()}” 추가
                  </button>
                </>
              )}
          </div>
        )}
      </div>

      {atLimit && (
        <p className="text-xs text-muted-foreground">
          최대 {maxSelected}개까지 선택할 수 있습니다.
        </p>
      )}
    </div>
  );
}

// 임시 id 생성기(자유 입력 & onCreate 미사용 시)
let __temp = -1;
function genTempId() {
  return __temp--;
}
