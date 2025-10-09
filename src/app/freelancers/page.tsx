"use client";

import { useListFreelancer } from "@/global/api/useFreelancerQuery";

import { FreelancerCard } from "./_components/FreelancerCard";
import { FreelancerFilters } from "./_components/FreelancerFilters";

export default function FreelancersPage() {
  const { data, isLoading } = useListFreelancer();
  console.log(data);
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
          <FreelancerFilters />

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

          {/* Load More (무한스크롤) */}
          {/* <div className="text-center pt-8">
            <button className="px-6 py-2 border rounded-md hover:bg-accent transition-colors">
              더 많은 프리랜서 보기
            </button>
          </div> */}
        </div>
      </main>
    </div>
  );
}
