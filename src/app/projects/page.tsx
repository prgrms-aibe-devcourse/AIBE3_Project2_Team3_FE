"use client";

import { useListProject } from "@/global/api/useProjectQuery";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { useProjectListStore } from "@/global/stores/useProjectListStore";

import { ProjectCard } from "./_components/ProjectCard";
import { ProjectFilters } from "./_components/ProjectFilters";

export default function ProjectsPage() {
  const { data, isLoading } = useListProject();
  const { page, setPage } = useProjectListStore((state) => state);
  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">프로젝트 찾기</h1>
          <p className="text-muted-foreground">
            당신의 스킬에 맞는 완벽한 프로젝트를 찾아보세요
          </p>
        </div>

        <div className="space-y-6">
          <ProjectFilters />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">총 {0}개의 프로젝트</p>
            <select className="text-sm border rounded-md px-3 py-1">
              <option>최신순</option>
              <option>예산 높은순</option>
              <option>예산 낮은순</option>
              <option>마감임박순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data &&
              data.content.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
        </div>
      </main>
    </div>
  );
}
