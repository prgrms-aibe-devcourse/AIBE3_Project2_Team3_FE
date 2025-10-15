"use client";

import {
  useCreateCategory,
  useListCategory,
  useRemoveCategory,
} from "@/global/api/useCategoryQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { ScrollArea, ScrollBar } from "@/global/components/ui/scroll-area";
import { cn } from "@/global/lib/utils";
import { CategoryTreeDto } from "@/global/types/category.types";
import { useEffect, useMemo, useState } from "react";

import { ConfirmDelete } from "../../../global/components/dialog/ConfirmDeleteDialog";
import { AddDialog } from "../_components/AddDialog";
import AdminLayout from "../_components/AdminLayout";

export default function CategoryPage() {
  const { data, isLoading } = useListCategory();
  const createMut = useCreateCategory();
  const removeMut = useRemoveCategory();

  // 부모/자식 분리 (서버가 트리 형태로 준다는 전제)
  const parents: CategoryTreeDto[] = useMemo(() => {
    if (!data) return [];
    // parentId == null 인 것만 부모로 간주
    return data.filter((c: CategoryTreeDto) => c.parentId == null);
  }, [data]);

  const [activeParentId, setActiveParentId] = useState<number | null>(null);

  // 초기 선택: 첫 부모 자동 선택
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

  // children은 부모 DTO의 children 사용(서버에서 이미 포함되어 온다고 가정)
  const children: CategoryTreeDto[] = activeParent?.children ?? [];

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-bold">카테고리 관리</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 상위 그룹 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>상위 카테고리</CardTitle>
            <AddDialog
              title="상위 카테고리 추가"
              triggerText="+ 추가"
              onConfirm={async (name) => {
                if (!name.trim()) return;
                await createMut.mutateAsync({ name: name.trim() }); // parentId 없음 → 상위
                // invalidate는 훅 내부 onSuccess에서 이미 수행
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
                          {p.childCount ?? p.children?.length ?? 0}개 하위
                          카테고리
                        </div>
                      </button>

                      {/* 상위 삭제 버튼 (원한다면) */}
                      <ConfirmDelete
                        title="상위 카테고리 삭제"
                        description="하위 항목이 있으면 삭제가 제한될 수 있습니다."
                        onConfirm={async () => {
                          await removeMut.mutateAsync(p.id);
                          // invalidate는 훅 내부 onSuccess에서 이미 수행
                        }}
                      />
                    </div>
                  ))}

                {!isLoading && !parents.length && (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    등록된 상위 카테고리가 없습니다.
                  </div>
                )}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 하위 그룹 */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>
              {activeParent
                ? `${activeParent.name} 하위 카테고리`
                : "하위 카테고리"}
            </CardTitle>
            <AddDialog
              triggerText="+ 추가"
              title="하위 카테고리 추가"
              onConfirm={async (name) => {
                if (!activeParent || !name.trim()) return;
                await createMut.mutateAsync({
                  name: name.trim(),
                  parentId: activeParent.id,
                });
                // invalidate로 새로고침
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
                  children.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                    >
                      <span className="font-medium">{c.name}</span>
                      <ConfirmDelete
                        title="하위 카테고리 삭제"
                        onConfirm={async () => {
                          await removeMut.mutateAsync(c.id);
                          // invalidate로 새로고침
                        }}
                      />
                    </div>
                  ))}

                {!isLoading && activeParent && !children.length && (
                  <div className="text-sm text-muted-foreground">
                    선택된 상위 카테고리의 하위 항목이 없습니다.
                  </div>
                )}

                {!isLoading && !activeParent && (
                  <div className="text-sm text-muted-foreground">
                    상위 카테고리를 먼저 선택하세요.
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
