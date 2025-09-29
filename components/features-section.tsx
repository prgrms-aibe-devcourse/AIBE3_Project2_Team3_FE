import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Shield, Star, FileText, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: "스마트 매칭",
      description: "AI 기반 알고리즘으로 프로젝트와 프리랜서를 정확하게 매칭합니다.",
      highlight: "95% 매칭률",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "실시간 채팅",
      description: "프로젝트 진행 중 실시간으로 소통하고 파일을 공유할 수 있습니다.",
      highlight: "즉시 소통",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "안전한 결제",
      description: "에스크로 시스템으로 안전하게 결제하고 프로젝트를 관리합니다.",
      highlight: "100% 보장",
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "리뷰 시스템",
      description: "투명한 리뷰와 평점으로 신뢰할 수 있는 파트너를 찾으세요.",
      highlight: "투명한 평가",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "포트폴리오 관리",
      description: "프로젝트 결과물과 포트폴리오를 체계적으로 관리할 수 있습니다.",
      highlight: "전문 관리",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "성과 분석",
      description: "대시보드에서 프로젝트 현황과 수익을 한눈에 확인하세요.",
      highlight: "실시간 분석",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            왜 <span className="text-primary">TalentLink</span>를 선택해야 할까요?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            프리랜서와 클라이언트 모두를 위한 완벽한 기능들을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-background/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {feature.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
