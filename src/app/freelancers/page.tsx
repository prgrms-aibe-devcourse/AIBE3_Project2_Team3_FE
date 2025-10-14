"use client";

import { useListCategory } from "@/global/api/useCategoryQuery";
import { useListFreelancer } from "@/global/api/useFreelancerQuery";
import { useListRegion } from "@/global/api/useRegionQuery";
import { useListSkill } from "@/global/api/useSkillQuery";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { useFreelancerListStore } from "@/global/stores/useFreelancerListStore";
import { PagePayloadSkillDto } from "@/global/types/skill.types";
import { useMemo } from "react";

import { FreelancerCard } from "./_components/FreelancerCard";
import { FreelancerFilters } from "./_components/FreelancerFilters";

export default function FreelancersPage() {
  const { data, isLoading } = useListFreelancer();
  const { page, setPage } = useFreelancerListStore((state) => state);
  const { data: categoryTree, isLoading: catLoading } = useListCategory();
  const { data: regionTree, isLoading: regLoading } = useListRegion();
  const { data: skillsPages, isLoading: skillLoading } = useListSkill();
  const skills = useMemo(() => {
    if (!skillsPages?.pages) return [];
    return skillsPages.pages.flatMap((pg: PagePayloadSkillDto) => {
      return pg.content ?? [];
    });
  }, [skillsPages]);
  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">프리랜서 찾기</h1>
          <p className="text-muted-foreground">
            프로젝트에 딱 맞는 전문 프리랜서를 찾아보세요
          </p>
        </div>

        <div className="space-y-6">
          <FreelancerFilters
            categories={categoryTree ?? []}
            regions={regionTree ?? []}
            skills={skills}
            onApply={(f) => {
              console.log(f);
            }}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {!!data ? `총 ${data.page.totalElements}명의 프리랜서` : ""}
            </p>
            <select className="text-sm border rounded-md px-3 py-1">
              <option>추천순</option>
              <option>평점 높은순</option>
              <option>요금 낮은순</option>
              <option>요금 높은순</option>
              <option>최근 활동순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data &&
              data.content.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
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
