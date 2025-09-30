import { FreelancerCard } from "@/components/freelancer/freelancer-card";
import { FreelancerFilters } from "@/components/freelancer/freelancer-filters";

// Mock data
const mockFreelancers = [
  {
    id: "1",
    name: "김개발",
    title: "풀스택 개발자",
    rating: 4.9,
    reviewCount: 24,
    hourlyRate: "시간당 50,000원",
    location: "서울",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "AWS"],
    description:
      "5년 이상의 웹 개발 경험을 가진 풀스택 개발자입니다. React와 Node.js를 주력으로 하며, 사용자 경험을 최우선으로 하는 웹 애플리케이션을 개발합니다.",
    completedProjects: 32,
    responseTime: "1시간 이내",
    isOnline: true,
    isFavorited: false,
  },
  {
    id: "2",
    name: "이디자인",
    title: "UI/UX 디자이너",
    rating: 4.8,
    reviewCount: 18,
    hourlyRate: "시간당 40,000원",
    location: "부산",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
    description:
      "사용자 중심의 디자인을 추구하는 UI/UX 디자이너입니다. 모바일과 웹 인터페이스 디자인에 특화되어 있으며, 사용성과 미적 감각을 모두 고려한 디자인을 제공합니다.",
    completedProjects: 28,
    responseTime: "2시간 이내",
    isOnline: false,
    isFavorited: true,
  },
  {
    id: "3",
    name: "박마케팅",
    title: "디지털 마케팅 전문가",
    rating: 4.7,
    reviewCount: 15,
    hourlyRate: "시간당 35,000원",
    location: "원격근무",
    skills: ["SEO", "Google Ads", "Facebook Ads", "콘텐츠 마케팅"],
    description:
      "데이터 기반의 디지털 마케팅 전략을 수립하고 실행하는 전문가입니다. ROI 최적화와 브랜드 인지도 향상에 집중하여 클라이언트의 비즈니스 성장을 돕습니다.",
    completedProjects: 22,
    responseTime: "30분 이내",
    isOnline: true,
    isFavorited: false,
  },
];

export default function FreelancersPage() {
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
              총 {mockFreelancers.length}명의 프리랜서
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
            {mockFreelancers.map((freelancer) => (
              <FreelancerCard key={freelancer.id} freelancer={freelancer} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <button className="px-6 py-2 border rounded-md hover:bg-accent transition-colors">
              더 많은 프리랜서 보기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
