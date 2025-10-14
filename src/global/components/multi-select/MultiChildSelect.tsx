"use client";

import { Checkbox } from "@/global/components/ui/checkbox";
import { cn } from "@/global/lib/utils";
import { CategoryTreeDto } from "@/global/types/category.types";
import { RegionTreeDto } from "@/global/types/region.types";
import { useCallback, useMemo, useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  data: (CategoryTreeDto | RegionTreeDto)[]; // 1뎁스 목록
  value: number[]; // 선택된 leaf id 배열
  onChange: (ids: number[]) => void;
  className?: string;
};

export function MultiChildSelect({ data, value, onChange, className }: Props) {
  // 펼침 상태(부모 id 기준)
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleLeaf = (id: number) => {
    const next = new Set(selectedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(Array.from(next));
  };

  const toggleParent = (node: CategoryTreeDto | RegionTreeDto) => {
    const leafIds = collectLeaves(node);
    const next = new Set(selectedSet);
    const allSelected = leafIds.every((id) => next.has(id));
    if (allSelected) leafIds.forEach((id) => next.delete(id));
    else leafIds.forEach((id) => next.add(id));
    onChange(Array.from(next));
  };

  const parentState = useCallback(
    (node: CategoryTreeDto | RegionTreeDto) => {
      const leafIds = collectLeaves(node);
      const sel = leafIds.filter((id) => selectedSet.has(id)).length;
      const all = sel === leafIds.length && leafIds.length > 0;
      const some = sel > 0 && sel < leafIds.length;
      return { all, some };
    },
    [selectedSet],
  );

  return (
    <div
      className={cn(
        "border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto",
        className,
      )}
    >
      {data.map((node) => {
        const hasChildren = !!node.children?.length;
        const { all, some } = parentState(node);

        return (
          <div key={node.id} className="mb-2">
            <div className="flex items-center justify-between">
              {/* 부모 라벨/체크박스 */}
              <label className="flex items-center cursor-pointer select-none gap-2">
                <Checkbox
                  // 부모는 자식 선택 수에 따라 3상태
                  checked={
                    hasChildren
                      ? all
                        ? true
                        : some
                          ? "indeterminate"
                          : false
                      : selectedSet.has(node.id)
                  }
                  onCheckedChange={() =>
                    hasChildren ? toggleParent(node) : toggleLeaf(node.id)
                  }
                  className="size-4"
                  aria-label={`${node.name} 선택`}
                />
                <span
                  className={cn(
                    "font-medium",
                    hasChildren ? "text-gray-900" : "text-gray-800",
                  )}
                >
                  {node.name}
                </span>
              </label>

              {/* 펼침/접힘 버튼: 자식 있을 때만 */}
              {hasChildren ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleExpand(node.id);
                  }}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
                  aria-label={expanded.has(node.id) ? "접기" : "펼치기"}
                >
                  {expanded.has(node.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="w-5 h-5" />
              )}
            </div>

            {/* 자식 목록 */}
            {hasChildren && expanded.has(node.id) && (
              <div className="ml-6 mt-2 space-y-1">
                {node.children!.map((child) => (
                  <label
                    key={child.id}
                    className="flex items-center cursor-pointer select-none gap-2"
                  >
                    <Checkbox
                      checked={selectedSet.has(child.id)}
                      onCheckedChange={() => toggleLeaf(child.id)}
                      className="size-4"
                      aria-label={`${child.name} 선택`}
                    />
                    <span className="text-gray-700">{child.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** 해당 노드의 leaf id 수집 (depth=2 가정, 안전하게 재귀 지원) */
function collectLeaves(node: CategoryTreeDto | RegionTreeDto): number[] {
  if (!node.children || node.children.length === 0) return [node.id];
  const out: number[] = [];
  for (const c of node.children) {
    if (!c.children || c.children.length === 0) out.push(c.id);
    else out.push(...collectLeaves(c));
  }
  return out;
}
