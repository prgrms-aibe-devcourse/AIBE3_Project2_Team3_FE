"use client";

import { useCreateSkill, useListSkill } from "@/global/api/useSkillQuery";
import { Badge } from "@/global/components/ui/badge";
import { Input } from "@/global/components/ui/input";
import { cn } from "@/global/lib/utils";
import { useSkillListStore } from "@/global/stores/useSkillListStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Search, X } from "lucide-react";

export type Item = { id: number; name: string };

type LoaderResult = {
  items: Item[];
  last: boolean; // 더 불러올 게 없으면 true
};

type Props = {
  value: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  maxSelected?: number;
  allowCreate?: boolean;
  className?: string;
};

export function AsyncInfiniteMultiSelect({
  value,
  onChange,
  placeholder = "스킬을 검색/선택하세요",
  maxSelected,
  allowCreate = true,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  // 전역 검색어는 store로, 입력은 로컬로 → 디바운스 후만 store 갱신
  const { search, setSearch } = useSkillListStore();
  const [text, setText] = useState(search);
  const [debounced, setDebounced] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(text.trim()), 400);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    if (debounced !== search) setSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // 무한스크롤 데이터
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useListSkill();

  // 서버에서 내려온 전체(평탄화)
  const fetched: Item[] = useMemo(
    () =>
      (data?.pages ?? []).flatMap((p) =>
        (p.content ?? []).map((s) => ({ id: s.id, name: s.name })),
      ),
    [data],
  );

  // 방금 생성한 항목(아직 서버 목록에 합류 전) 임시 캐시
  const [tempNameMap, setTempNameMap] = useState<Record<number, string>>({});

  // id → name 레지스트리 (temp 우선)
  const fetchedMap = useMemo(() => {
    const m = new Map<number, string>();
    for (const it of fetched) m.set(it.id, it.name);
    return m;
  }, [fetched]);

  const nameById = useCallback(
    (id: number) => tempNameMap[id] ?? fetchedMap.get(id) ?? `#${id}`,
    [tempNameMap, fetchedMap],
  );

  // 제안: 선택된 것은 제외 + (필요시 temp 항목도 노출)
  const idSet = useMemo(() => new Set(value), [value]);
  const suggestions = useMemo(
    () => fetched.filter((o) => !idSet.has(o.id)),
    [fetched, idSet],
  );

  // 바깥 클릭 닫힘
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // 인터섹션 옵저버로 다음 페이지 로드
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [open, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 선택/제거
  const atLimit =
    typeof maxSelected === "number" && value.length >= maxSelected;

  const add = (id: number) => {
    if (atLimit || idSet.has(id)) return;
    onChange([...value, id]);
    setOpen(false);
    setHighlight(0);
  };

  const remove = (id: number) => onChange(value.filter((v) => v !== id));

  // 생성 훅
  const createMut = useCreateSkill();
  const handleCreate = async () => {
    const textTrim = debounced.trim();
    if (!allowCreate || !textTrim) return;

    // 이미 존재하면 채택
    const existing = fetched.find(
      (i) => i.name.toLowerCase() === textTrim.toLowerCase(),
    );
    if (existing) {
      add(existing.id);
      setText("");
      return;
    }

    // 생성
    const res = await createMut.mutateAsync({ name: textTrim });

    // unwrap 스키마 호환: {id,name} 또는 RsData<{id,name}>
    const createdId: number = res?.data?.id as number;
    const createdName: string = (res?.data?.name ?? textTrim) as string;

    if (typeof createdId !== "number") {
      // 실패 방어
      return;
    }

    // 1) 임시 레지스트리에 등록 → 즉시 라벨 표시
    setTempNameMap((m) => ({ ...m, [createdId]: createdName }));

    // 2) 선택 추가
    add(createdId);

    // 3) 인풋 정리
    setText("");

    // 4) 서버 목록 최신화(선택)
    await refetch();

    // 5) (선택) refetch 후 tempNameMap 정리해도 OK (여기선 유지해도 무방)
    // setTempNameMap((m) => { const { [createdId]: _, ...rest } = m; return rest; });
  };

  // 키보드 네비
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && text.length === 0 && value.length > 0) {
      e.preventDefault();
      remove(value[value.length - 1]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(0, suggestions.length - 1)));
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
      if (open && suggestions.length) {
        add(
          suggestions[Math.max(0, Math.min(highlight, suggestions.length - 1))]
            .id,
        );
      } else {
        void handleCreate();
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn("space-y-3", className)}>
      {/* 선택 칩 */}
      <div className="flex flex-wrap gap-2">
        {value.map((id) => (
          <Badge key={id} className="inline-flex items-center gap-1">
            {nameById(id)}
            <button type="button" onClick={() => remove(id)} aria-label="제거">
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
      </div>

      {/* 입력 + 드롭다운 */}
      <div className="relative">
        <div className="relative">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="pl-9"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {open && (
          <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-lg border bg-background shadow-md">
            {/* 로딩 */}
            {status === "pending" && (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                불러오는 중…
              </div>
            )}

            {/* 제안 목록 */}
            {suggestions.map((opt, i) => (
              <button
                key={opt.id}
                type="button"
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                  i === highlight
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/60",
                )}
                onClick={() => add(opt.id)}
                disabled={atLimit}
              >
                <span className="truncate">{opt.name}</span>
              </button>
            ))}

            {/* 생성 버튼 */}
            {allowCreate &&
              debounced &&
              !fetched.some(
                (o) => o.name.toLowerCase() === debounced.toLowerCase(),
              ) && (
                <>
                  {!!suggestions.length && (
                    <div className="mx-2 my-1 h-px bg-border" />
                  )}
                  <button
                    type="button"
                    className="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-accent/60"
                    onClick={() => void handleCreate()}
                    disabled={atLimit || createMut.isPending}
                  >
                    “{debounced}” 추가
                  </button>
                </>
              )}

            {/* 무한스크롤 센티넬 */}
            <div ref={sentinelRef} className="h-6" />
            {isFetchingNextPage && (
              <div className="px-3 py-2 text-xs text-muted-foreground">
                더 불러오는 중…
              </div>
            )}
            {!hasNextPage &&
              status === "success" &&
              suggestions.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  결과가 없어요.
                </div>
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
