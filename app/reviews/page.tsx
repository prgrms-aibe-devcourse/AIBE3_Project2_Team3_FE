import { ReviewList } from "@/components/review/review-list";
import { ReviewStats } from "@/components/review/review-stats";

// Mock data
const mockReviewStats = {
  totalReviews: 48,
  averageRating: 4.7,
  ratingDistribution: {
    5: 28,
    4: 12,
    3: 5,
    2: 2,
    1: 1,
  },
};

const mockReviews = [
  {
    id: "1",
    rating: 5,
    title: "완벽한 프로젝트 진행",
    content:
      "김개발님과 함께한 프로젝트는 정말 만족스러웠습니다. 요구사항을 정확히 파악하고 예상보다 빠르게 고품질의 결과물을 제공해주셨습니다. 커뮤니케이션도 원활했고, 중간중간 진행상황을 공유해주셔서 안심하고 프로젝트를 맡길 수 있었습니다. 다음에도 꼭 함께 작업하고 싶습니다.",
    author: {
      name: "이클라이언트",
      avatar: "/placeholder.svg",
      role: "client" as const,
    },
    project: {
      title: "전자상거래 웹사이트 개발",
      category: "웹 개발",
    },
    createdAt: "2024-01-10",
    helpful: 12,
    isHelpful: false,
    canEdit: false,
  },
  {
    id: "2",
    rating: 4,
    title: "전문적이고 신뢰할 수 있는 클라이언트",
    content:
      "프로젝트 요구사항이 명확했고, 피드백도 구체적이어서 작업하기 편했습니다. 일정에 대한 이해도 높으시고, 중간 점검도 적절히 해주셔서 좋았습니다. 다만 초기 기획 단계에서 조금 더 자세한 논의가 있었다면 더 좋았을 것 같습니다.",
    author: {
      name: "박프리랜서",
      avatar: "/placeholder.svg",
      role: "freelancer" as const,
    },
    project: {
      title: "모바일 앱 UI/UX 디자인",
      category: "디자인",
    },
    createdAt: "2024-01-08",
    helpful: 8,
    isHelpful: true,
    canEdit: false,
  },
  {
    id: "3",
    rating: 5,
    title: "뛰어난 디자인 감각과 소통 능력",
    content:
      "정말 만족스러운 결과물을 받았습니다. 처음 제시한 아이디어를 바탕으로 더 나은 방향을 제안해주시고, 사용자 경험을 고려한 디자인을 만들어주셨습니다. 수정 요청에도 빠르게 대응해주시고, 최종 결과물의 품질이 기대 이상이었습니다.",
    author: {
      name: "최스타트업",
      avatar: "/placeholder.svg",
      role: "client" as const,
    },
    project: {
      title: "브랜드 아이덴티티 디자인",
      category: "그래픽 디자인",
    },
    createdAt: "2024-01-05",
    helpful: 15,
    isHelpful: false,
    canEdit: false,
  },
  {
    id: "4",
    rating: 3,
    title: "보통 수준의 프로젝트",
    content:
      "전반적으로 무난한 프로젝트였습니다. 요구사항은 충족했지만 특별히 인상적인 부분은 없었습니다. 커뮤니케이션은 원활했으나 창의적인 제안이나 추가적인 가치 제공은 부족했습니다.",
    author: {
      name: "김중소기업",
      avatar: "/placeholder.svg",
      role: "client" as const,
    },
    project: {
      title: "회사 홈페이지 제작",
      category: "웹 개발",
    },
    createdAt: "2024-01-03",
    helpful: 3,
    isHelpful: false,
    canEdit: false,
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">리뷰</h1>
          <p className="text-muted-foreground">
            프리랜서와 클라이언트의 솔직한 후기를 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <ReviewStats stats={mockReviewStats} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <ReviewList reviews={mockReviews} />
          </div>
        </div>
      </main>
    </div>
  );
}
