import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "김민수",
      role: "스타트업 CEO",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      content:
        "TalentLink를 통해 정말 훌륭한 개발자를 만났습니다. 프로젝트가 예상보다 빨리 완료되었고, 품질도 매우 만족스럽습니다.",
    },
    {
      name: "박지영",
      role: "UI/UX 디자이너",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      content:
        "프리랜서로 활동하면서 가장 만족스러운 플랫폼입니다. 매칭 시스템이 정확해서 제 스킬에 맞는 프로젝트를 쉽게 찾을 수 있어요.",
    },
    {
      name: "이창호",
      role: "마케팅 전문가",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      content:
        "안전한 결제 시스템과 체계적인 프로젝트 관리 덕분에 안심하고 일할 수 있습니다. 클라이언트와의 소통도 원활해요.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            사용자들의 <span className="text-primary">생생한 후기</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            이미 많은 프리랜서와 클라이언트가 TalentLink와 함께 성공하고 있습니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-background/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
