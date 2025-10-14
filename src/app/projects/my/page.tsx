"use client";

import { useListMyProjects } from "@/global/api/useProjectQuery";
import { Card } from "@/global/components/ui/card";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { useMyProjectListStore } from "@/global/stores/useMyProjectListStore";
import { useMemo } from "react";

import ProjectRow from "./_components/ProjectRow";

export default function MyProjectsPage() {
  const { page, setPage } = useMyProjectListStore((state) => state);

  const { data, status, refetch, isFetching } = useListMyProjects();

  const items = useMemo(() => data?.content ?? [], [data]);

  return (
    <main className="w-full py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">내 프로젝트</h1>

      {/* 리스트 (세로 1열) */}
      <div className="flex flex-col gap-4">
        {status === "pending" &&
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="h-36 animate-pulse" />
          ))}

        {status === "success" && items.length === 0 && (
          <div className="rounded-xl border p-10 text-center text-muted-foreground">
            작성한 프로젝트가 없습니다.
          </div>
        )}

        {items.map((it: any) => (
          <ProjectRow key={it.id} project={it} onDeleted={() => refetch()} />
        ))}
      </div>

      {/* 페이지네이션 바 */}
      <div className="text-center pt-8">
        {data && (
          <PaginationBar
            pageIndex={page}
            pageCount={data.page.totalPages}
            onPageIndexChange={setPage}
          />
        )}
      </div>

      {isFetching && (
        <div className="text-center text-sm text-muted-foreground py-2">
          불러오는 중…
        </div>
      )}
    </main>
  );
}
