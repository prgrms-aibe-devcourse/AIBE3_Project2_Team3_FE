import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, UserPlus, Search, MessageSquare, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "회원가입",
      description: "간단한 정보 입력으로 프리랜서 또는 클라이언트로 가입하세요",
      color: "bg-blue-500",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "매칭 찾기",
      description: "AI 추천 시스템으로 완벽한 프로젝트나 프리랜서를 찾아보세요",
      color: "bg-green-500",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "소통하기",
      description: "실시간 채팅으로 프로젝트 세부사항을 논의하고 계약하세요",
      color: "bg-purple-500",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "프로젝트 완료",
      description: "안전한 결제 시스템으로 프로젝트를 완료하고 리뷰를 남기세요",
      color: "bg-orange-500",
    },
  ]

  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-primary">4단계</span>로 시작하는 프리랜싱
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            복잡한 절차 없이 간단하게 시작할 수 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="relative">
                    <div
                      className={`h-16 w-16 rounded-full ${step.color} flex items-center justify-center text-white mx-auto`}
                    >
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/signup">
              지금 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
