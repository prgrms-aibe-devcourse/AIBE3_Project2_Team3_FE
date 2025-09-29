import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10" />
          <div className="relative p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 mr-2" />
              <h2 className="text-3xl lg:text-4xl font-bold">지금 시작하세요!</h2>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              수천 명의 전문 프리랜서와 함께 성공적인 프로젝트를 시작해보세요. 가입비는 무료이며, 성공한 프로젝트에서만
              수수료가 발생합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/signup">
                  프리랜서로 가입하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/projects">클라이언트로 시작하기</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
