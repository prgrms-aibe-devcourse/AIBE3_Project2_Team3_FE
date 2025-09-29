import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Clock, Star, Calendar, Users, Eye, Heart, Flag } from "lucide-react"

interface ProjectDetailProps {
  project: {
    id: string
    title: string
    description: string
    budget: string
    duration: string
    location: string
    skills: string[]
    category: string
    client: {
      name: string
      avatar?: string
      rating: number
      reviewCount: number
      joinedAt: string
      completedProjects: number
    }
    postedAt: string
    deadline: string
    applicants: number
    views: number
    requirements: string[]
    deliverables: string[]
  }
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{project.category}</Badge>
                  <Badge variant="outline">{project.location}</Badge>
                </div>
                <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.postedAt}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {project.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {project.applicants}명 지원
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    {project.views}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">프로젝트 설명</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">필요 스킬</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">요구사항</h3>
              <ul className="space-y-2">
                {project.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">결과물</h3>
              <ul className="space-y-2">
                {project.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-muted-foreground">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Apply Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-primary">{project.budget}</CardTitle>
            <p className="text-sm text-muted-foreground">마감일: {project.deadline}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              지원하기
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              문의하기
            </Button>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle>클라이언트 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={project.client.avatar || "/placeholder.svg"} />
                <AvatarFallback>{project.client.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{project.client.name}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {project.client.rating} ({project.client.reviewCount}개 리뷰)
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">가입일</span>
                <span>{project.client.joinedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">완료 프로젝트</span>
                <span>{project.client.completedProjects}개</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              프로필 보기
            </Button>
          </CardContent>
        </Card>

        {/* Similar Projects */}
        <Card>
          <CardHeader>
            <CardTitle>비슷한 프로젝트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <h4 className="font-medium text-sm line-clamp-2">React 기반 웹 애플리케이션 개발 프로젝트 {i}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>500만원 - 1000만원</span>
                  <span>2주 전</span>
                </div>
                <Separator />
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm">
              더 보기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
