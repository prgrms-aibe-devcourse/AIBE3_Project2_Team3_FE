"use client";

import { Button } from "@/global/components/ui/button";
import { Checkbox } from "@/global/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/global/components/ui/popover";
import { cn } from "@/global/lib/utils";
import { useState } from "react";

import { ChevronsUpDown } from "lucide-react";

export type TreeNode = { id: number; name: string; children?: TreeNode[] };

type TreeMultiSelectProps = {
  value: number[];
  onChange: (next: number[]) => void;
  options: TreeNode[];
  placeholder?: string;
  includeChildrenWhenParentChecked?: boolean; // 부모 클릭 시 하위 전체 토글
  className?: string;
};

export function TreeMultiSelect({
  value,
  onChange,
  options,
  placeholder = "선택",
  includeChildrenWhenParentChecked = true,
  className,
}: TreeMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const flatMapIds = (nodes: TreeNode[]): number[] =>
    nodes.flatMap((n) => [n.id, ...(n.children ? flatMapIds(n.children) : [])]);

  const toggleId = (id: number, childIds: number[] = []) => {
    const set = new Set(value);
    const ids = [id, ...childIds];
    const allOn = ids.every((x) => set.has(x));
    if (allOn) {
      ids.forEach((x) => set.delete(x));
    } else {
      ids.forEach((x) => set.add(x));
    }
    onChange(Array.from(set));
  };

  const renderNode = (node: TreeNode) => {
    const childIds = node.children ? flatMapIds(node.children) : [];
    const allIds = [node.id, ...childIds];
    const checkedCount = allIds.filter((id) => value.includes(id)).length;
    const indeterminate =
      checkedCount > 0 &&
      checkedCount < allIds.length &&
      !!node.children?.length;
    const checked = checkedCount === allIds.length;

    return (
      <div key={node.id} className="space-y-1">
        <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/70">
          <Checkbox
            checked={checked}
            onCheckedChange={() =>
              includeChildrenWhenParentChecked
                ? toggleId(node.id, childIds)
                : toggleId(node.id, [])
            }
            className={cn(
              indeterminate && "data-[state=indeterminate]:bg-primary/40",
            )}
          />
          <span className="text-sm">{node.name}</span>
        </label>
        {!!node.children?.length && (
          <div className="pl-6 border-l ml-3 space-y-1">
            {node.children.map((c) => {
              const isOn = value.includes(c.id);
              return (
                <label
                  key={c.id}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/70"
                >
                  <Checkbox
                    checked={isOn}
                    onCheckedChange={() => toggleId(c.id, [])}
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 overflow-y-auto max-h-80">
        <div className="space-y-2">{options.map(renderNode)}</div>
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
