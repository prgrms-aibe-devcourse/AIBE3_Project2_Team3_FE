import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Star, Users, Briefcase } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container relative px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            재능있는 프리랜서와
            <br />
            <span className="text-primary">완벽한 매칭</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            전문 프리랜서들과 프로젝트를 연결하는 신뢰할 수 있는 플랫폼입니다. 당신의 비즈니스에 딱 맞는 재능을
            찾아보세요.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/signup">
                프리랜서로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/projects">프로젝트 둘러보기</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">활성 프리랜서</div>
            </Card>

            <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">5,000+</div>
              <div className="text-sm text-muted-foreground">완료된 프로젝트</div>
            </Card>

            <Card className="p-6 text-center border-0 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-2">4.9/5</div>
              <div className="text-sm text-muted-foreground">평균 만족도</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
