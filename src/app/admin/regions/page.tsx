"use client";

import {
  useCreateRegion,
  useListRegion,
  useRemoveRegion,
} from "@/global/api/useRegionQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { ScrollArea, ScrollBar } from "@/global/components/ui/scroll-area";
import { cn } from "@/global/lib/utils";
import { RegionTreeDto } from "@/global/types/region.types";
import { useEffect, useMemo, useState } from "react";

import { AddDialog } from "../_components/AddDialog";
import AdminLayout from "../_components/AdminLayout";
import { ConfirmDelete } from "../_components/ConfirmDeleteDialog";

export default function RegionsPage() {
  const { data, isLoading } = useListRegion();
  const createMut = useCreateRegion();
  const removeMut = useRemoveRegion();

  // 부모 리스트 추출
  const parents: RegionTreeDto[] = useMemo(() => {
    if (!data) return [];
    return (data as RegionTreeDto[]).filter((r) => r.parentId == null);
  }, [data]);

  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  // 초기/리셋 시 첫 부모 자동 선택
  useEffect(() => {
    if (!parents.length) {
      setActiveParentId(null);
      return;
    }
    if (!activeParentId || !parents.some((p) => p.id === activeParentId)) {
      setActiveParentId(parents[0].id);
    }
  }, [parents, activeParentId]);

  const activeParent = useMemo(
    () => parents.find((p) => p.id === activeParentId) ?? null,
    [parents, activeParentId],
  );

  const children = activeParent?.children ?? [];

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-bold">지역 관리</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 상위 지역 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>상위 지역</CardTitle>
            <AddDialog
              title="상위 지역 추가"
              triggerText="+ 추가"
              onConfirm={async (name) => {
                const trimmed = name.trim();
                if (!trimmed) return;
                await createMut.mutateAsync({ name: trimmed }); // parentId 없음 → 상위
                // 목록 갱신은 훅 onSuccess에서 invalidate 처리됨
              }}
            />
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="h-full max-h-[65vh]">
              <div className="space-y-2 px-4 py-3">
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    불러오는 중...
                  </div>
                )}

                {!isLoading &&
                  parents.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveParentId(p.id)}
                        className={cn(
                          "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                          activeParentId === p.id
                            ? "bg-primary/10 border-primary/30"
                            : "hover:bg-muted",
                        )}
                      >
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.childCount ?? p.children?.length ?? 0}개 하위 지역
                        </div>
                      </button>

                      {/* 상위 삭제(원하면 노출) */}
                      <ConfirmDelete
                        title="상위 지역 삭제"
                        description="하위 지역이 있으면 삭제가 제한될 수 있습니다."
                        onConfirm={async () => {
                          await removeMut.mutateAsync(p.id);
                        }}
                      />
                    </div>
                  ))}

                {!isLoading && !parents.length && (
                  <div className="text-sm text-muted-foreground">
                    등록된 상위 지역이 없습니다.
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 하위 지역 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              {activeParent ? `${activeParent.name} 하위 지역` : "하위 지역"}
            </CardTitle>
            <AddDialog
              title="하위 지역 추가"
              triggerText="+ 추가"
              onConfirm={async (name) => {
                if (!activeParent) return;
                const trimmed = name.trim();
                if (!trimmed) return;
                await createMut.mutateAsync({
                  name: trimmed,
                  parentId: activeParent.id,
                });
              }}
            />
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="h-full max-h-[65vh]">
              <div className="space-y-2 px-4 py-3">
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    불러오는 중...
                  </div>
                )}

                {!isLoading &&
                  activeParent &&
                  children.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                    >
                      <span className="font-medium">{c.name}</span>
                      <ConfirmDelete
                        title="하위 지역 삭제"
                        onConfirm={async () => {
                          await removeMut.mutateAsync(c.id);
                        }}
                      />
                    </div>
                  ))}

                {!isLoading && activeParent && !children.length && (
                  <div className="text-sm text-muted-foreground">
                    선택된 상위 지역의 하위 항목이 없습니다.
                  </div>
                )}
                {!isLoading && !activeParent && (
                  <div className="text-sm text-muted-foreground">
                    상위 지역을 먼저 선택하세요.
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
