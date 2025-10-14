"use client";

import { useListMyFreelancers } from "@/global/api/useFreelancerQuery";
import { Card } from "@/global/components/ui/card";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { useMyFreelancerListStore } from "@/global/stores/useMyFreelancerListStore";
import { useMemo } from "react";

import FreelancerRow from "./_components/FreelancerRow";

export default function MyFreelancersPage() {
  const { page, setPage } = useMyFreelancerListStore((state) => state);

  const { data, status, refetch, isFetching } = useListMyFreelancers();

  const items = useMemo(() => data?.content ?? [], [data]);

  return (
    <main className="w-full py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">내 프리랜서 글</h1>

      <div className="flex flex-col gap-4">
        {status === "pending" &&
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="h-36 animate-pulse" />
          ))}

        {status === "success" && items.length === 0 && (
          <div className="rounded-xl border p-10 text-center text-muted-foreground">
            작성한 프리랜서 글이 없습니다.
          </div>
        )}

        {items.map((it: any) => (
          <FreelancerRow
            key={it.id}
            freelancer={it}
            onDeleted={() => refetch()}
          />
        ))}
      </div>

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
