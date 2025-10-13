"use client";

import {
  useCreateSkill,
  useListSkill,
  useRemoveSkill,
} from "@/global/api/useSkillQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { ScrollArea, ScrollBar } from "@/global/components/ui/scroll-area";
import { Separator } from "@/global/components/ui/separator";
import { useSkillListStore } from "@/global/stores/useSkillListStore";
import { useEffect, useMemo, useState } from "react";

import { AddDialog } from "../_components/AddDialog";
import AdminLayout from "../_components/AdminLayout";
import { ConfirmDelete } from "../_components/ConfirmDeleteDialog";

type Skill = { id: number; name: string; isActive: boolean };

export default function SkillsPage() {
  // 검색/정렬/페이지 사이즈 스토어
  const { size, sort, search, setSearch } = useSkillListStore((s) => s);

  // 입력박스용 로컬 상태 + 디바운스
  const [keyword, setKeyword] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setSearch(keyword), 300); // 300ms debounce
    return () => clearTimeout(t);
  }, [keyword, setSearch]);

  // 목록
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useListSkill();

  const skills: Skill[] = useMemo(
    () => (data?.pages ?? []).flatMap((p: any) => p.content ?? []),
    [data],
  );

  // 생성/삭제
  const createMut = useCreateSkill();
  const removeMut = useRemoveSkill();

  return (
    <AdminLayout>
      <h1 className="mb-8 text-3xl font-bold">스킬 관리</h1>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>스킬 목록</CardTitle>

          <div className="flex items-center gap-2">
            {/* 검색 */}
            <Input
              placeholder="스킬 검색 (예: React)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-56"
            />
            {/* 추가 */}
            <AddDialog
              title="스킬 추가"
              placeholder="예: NestJS"
              triggerText="+ 추가"
              onConfirm={async (name) => {
                const trimmed = name.trim();
                if (!trimmed) return;
                await createMut.mutateAsync({ name: trimmed });
              }}
            />
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-2 pt-4">
          <ScrollArea className="h-full max-h-[65vh]">
            <div className="space-y-2 px-4 py-3">
              {isLoading && (
                <div className="text-sm text-muted-foreground">
                  불러오는 중...
                </div>
              )}

              {!isLoading &&
                skills.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2"
                  >
                    <span className="font-medium">{s.name}</span>
                    <ConfirmDelete
                      title="스킬 삭제"
                      onConfirm={async () => {
                        await removeMut.mutateAsync(s.id);
                      }}
                    />
                  </div>
                ))}

              {!isLoading && skills.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              )}

              {/* 더보기(무한스크롤) */}
              {hasNextPage && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full"
                  >
                    {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
                  </Button>
                </div>
              )}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
