import { ProjectCard } from "@/components/project/project-card";
import { ProjectFilters } from "@/components/project/project-filters";

// Mock data
const mockProjects = [
  {
    id: "1",
    title: "React 기반 전자상거래 웹사이트 개발",
    description:
      "현대적인 디자인의 전자상거래 플랫폼을 React와 Next.js를 사용하여 개발해주실 프리랜서를 찾습니다. 결제 시스템, 상품 관리, 사용자 인증 등의 기능이 필요합니다.",
    budget: "500만원 - 800만원",
    duration: "2-3개월",
    location: "원격근무",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    client: {
      name: "김철수",
      rating: 4.8,
      reviewCount: 12,
    },
    postedAt: "2일 전",
    applicants: 8,
    views: 156,
    isFavorited: false,
  },
  {
    id: "2",
    title: "모바일 앱 UI/UX 디자인",
    description:
      "헬스케어 모바일 앱의 UI/UX 디자인을 담당해주실 디자이너를 찾습니다. 사용자 친화적이고 직관적인 인터페이스 설계가 필요합니다.",
    budget: "200만원 - 300만원",
    duration: "1개월",
    location: "서울",
    skills: ["UI/UX 디자인", "Figma", "Sketch"],
    client: {
      name: "이영희",
      rating: 4.9,
      reviewCount: 25,
    },
    postedAt: "1주 전",
    applicants: 15,
    views: 234,
    isFavorited: true,
  },
  {
    id: "3",
    title: "Spring Boot 백엔드 API 개발",
    description:
      "기존 레거시 시스템을 Spring Boot로 마이그레이션하고 RESTful API를 개발해주실 백엔드 개발자를 찾습니다.",
    budget: "600만원 - 1000만원",
    duration: "3-4개월",
    location: "부산",
    skills: ["Java", "Spring Boot", "MySQL", "AWS"],
    client: {
      name: "박민수",
      rating: 4.7,
      reviewCount: 8,
    },
    postedAt: "3일 전",
    applicants: 12,
    views: 189,
    isFavorited: false,
  },
];

export default function ProjectsPage() {
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
            <p className="text-sm text-muted-foreground">
              총 {mockProjects.length}개의 프로젝트
            </p>
            <select className="text-sm border rounded-md px-3 py-1">
              <option>최신순</option>
              <option>예산 높은순</option>
              <option>예산 낮은순</option>
              <option>마감임박순</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <button className="px-6 py-2 border rounded-md hover:bg-accent transition-colors">
              더 많은 프로젝트 보기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
