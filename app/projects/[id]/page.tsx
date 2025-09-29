import { Header } from "@/components/header"
import { ProjectDetail } from "@/components/project/project-detail"

// Mock data for project detail
const mockProject = {
  id: "1",
  title: "React 기반 전자상거래 웹사이트 개발",
  description:
    "현대적인 디자인의 전자상거래 플랫폼을 React와 Next.js를 사용하여 개발해주실 프리랜서를 찾습니다. 사용자 경험을 최우선으로 하는 반응형 웹사이트가 필요하며, 결제 시스템, 상품 관리, 사용자 인증, 주문 관리 등의 핵심 기능들이 포함되어야 합니다. 또한 관리자 대시보드를 통해 상품과 주문을 효율적으로 관리할 수 있는 시스템도 함께 개발해주시기 바랍니다.",
  budget: "500만원 - 800만원",
  duration: "2-3개월",
  location: "원격근무",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "Stripe"],
  category: "웹 개발",
  client: {
    name: "김철수",
    rating: 4.8,
    reviewCount: 12,
    joinedAt: "2023년 3월",
    completedProjects: 8,
  },
  postedAt: "2일 전",
  deadline: "2024년 12월 31일",
  applicants: 8,
  views: 156,
  requirements: [
    "React 및 Next.js 개발 경험 3년 이상",
    "TypeScript 사용 경험 필수",
    "결제 시스템 연동 경험 (Stripe, PayPal 등)",
    "반응형 웹 디자인 구현 능력",
    "RESTful API 설계 및 개발 경험",
    "Git을 활용한 협업 경험",
  ],
  deliverables: [
    "완전히 기능하는 전자상거래 웹사이트",
    "관리자 대시보드",
    "모바일 반응형 디자인",
    "결제 시스템 연동",
    "사용자 인증 시스템",
    "상품 및 주문 관리 기능",
    "소스 코드 및 문서화",
  ],
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 px-4">
        <ProjectDetail project={mockProject} />
      </main>
    </div>
  )
}
