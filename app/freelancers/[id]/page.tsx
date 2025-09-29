import { Header } from "@/components/header"
import { FreelancerProfile } from "@/components/freelancer/freelancer-profile"

// Mock data for freelancer profile
const mockFreelancer = {
  id: "1",
  name: "김개발",
  title: "풀스택 개발자 & 기술 컨설턴트",
  rating: 4.9,
  reviewCount: 24,
  hourlyRate: "시간당 50,000원",
  location: "서울, 대한민국",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "GraphQL"],
  description:
    "5년 이상의 웹 개발 경험을 가진 풀스택 개발자입니다. React와 Node.js를 주력으로 하며, 사용자 경험을 최우선으로 하는 웹 애플리케이션을 개발합니다. 스타트업부터 대기업까지 다양한 규모의 프로젝트 경험을 보유하고 있으며, 특히 전자상거래와 SaaS 플랫폼 개발에 특화되어 있습니다. 클린 코드와 확장 가능한 아키텍처를 중시하며, 항상 최신 기술 트렌드를 학습하고 적용하려 노력합니다.",
  completedProjects: 32,
  responseTime: "1시간 이내",
  joinedAt: "2022년 3월",
  languages: ["한국어", "영어"],
  education: [
    {
      degree: "컴퓨터공학 학사",
      school: "서울대학교",
      year: "2018년",
    },
  ],
  certifications: [
    {
      name: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023년",
    },
    {
      name: "Google Cloud Professional",
      issuer: "Google Cloud",
      year: "2022년",
    },
  ],
  portfolio: [
    {
      id: "1",
      title: "전자상거래 플랫폼",
      description:
        "React와 Node.js로 구축한 현대적인 전자상거래 플랫폼입니다. 결제 시스템, 재고 관리, 주문 추적 등의 기능을 포함합니다.",
      image: "/ecommerce-platform-concept.png",
      technologies: ["React", "Next.js", "Node.js", "PostgreSQL", "Stripe"],
      link: "https://example-ecommerce.com",
    },
    {
      id: "2",
      title: "SaaS 대시보드",
      description:
        "데이터 시각화와 실시간 분석을 제공하는 SaaS 대시보드입니다. 사용자 친화적인 인터페이스와 강력한 기능을 제공합니다.",
      image: "/saas-dashboard-overview.png",
      technologies: ["React", "TypeScript", "D3.js", "GraphQL"],
    },
    {
      id: "3",
      title: "모바일 앱 백엔드",
      description:
        "확장 가능한 모바일 앱 백엔드 API입니다. 사용자 인증, 푸시 알림, 데이터 동기화 등의 기능을 제공합니다.",
      image: "/mobile-app-backend.jpg",
      technologies: ["Node.js", "Express", "MongoDB", "Redis"],
    },
  ],
  reviews: [
    {
      id: "1",
      client: "스타트업 A",
      rating: 5,
      comment:
        "김개발님은 정말 훌륭한 개발자입니다. 요구사항을 정확히 이해하고 예상보다 빠르게 고품질의 결과물을 제공해주셨습니다. 커뮤니케이션도 원활하고 문제 해결 능력이 뛰어납니다.",
      project: "전자상거래 웹사이트 개발",
      date: "2024년 1월",
    },
    {
      id: "2",
      client: "중소기업 B",
      rating: 5,
      comment:
        "기술적 전문성이 뛰어나고 프로젝트 관리 능력도 우수합니다. 복잡한 요구사항도 체계적으로 분석하여 최적의 솔루션을 제안해주셨습니다.",
      project: "CRM 시스템 구축",
      date: "2023년 11월",
    },
    {
      id: "3",
      client: "대기업 C",
      rating: 4,
      comment:
        "전문적이고 신뢰할 수 있는 개발자입니다. 일정을 잘 지키고 코드 품질이 높습니다. 다음 프로젝트에서도 함께 작업하고 싶습니다.",
      project: "레거시 시스템 마이그레이션",
      date: "2023년 9월",
    },
  ],
}

export default function FreelancerProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 px-4">
        <FreelancerProfile freelancer={mockFreelancer} />
      </main>
    </div>
  )
}
