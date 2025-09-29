import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Calendar, Award, MessageCircle, Heart, Flag, ExternalLink } from "lucide-react"

interface FreelancerProfileProps {
  freelancer: {
    id: string
    name: string
    title: string
    avatar?: string
    rating: number
    reviewCount: number
    hourlyRate: string
    location: string
    skills: string[]
    description: string
    completedProjects: number
    responseTime: string
    joinedAt: string
    languages: string[]
    education: Array<{
      degree: string
      school: string
      year: string
    }>
    certifications: Array<{
      name: string
      issuer: string
      year: string
    }>
    portfolio: Array<{
      id: string
      title: string
      description: string
      image: string
      technologies: string[]
      link?: string
    }>
    reviews: Array<{
      id: string
      client: string
      rating: number
      comment: string
      project: string
      date: string
    }>
  }
}

export function FreelancerProfile({ freelancer }: FreelancerProfileProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={freelancer.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{freelancer.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{freelancer.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{freelancer.title}</p>
                <div className="flex items-center space-x-6 text-sm mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground ml-1">({freelancer.reviewCount}개 리뷰)</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {freelancer.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {freelancer.joinedAt} 가입
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-primary">{freelancer.hourlyRate}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    평균 {freelancer.responseTime} 응답
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            <TabsTrigger value="experience">경력</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>소개</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{freelancer.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>보유 스킬</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>언어</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {freelancer.languages.map((language) => (
                    <div key={language} className="flex items-center justify-between">
                      <span>{language}</span>
                      <Badge variant="outline">유창함</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freelancer.portfolio.map((item) => (
                <Card key={item.id}>
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg?height=200&width=300"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {freelancer.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-medium">{review.client}</div>
                      <div className="text-sm text-muted-foreground">{review.project}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>학력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {freelancer.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                    <div>
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-muted-foreground">{edu.school}</div>
                      <div className="text-sm text-muted-foreground">{edu.year}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>자격증</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {freelancer.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-sm text-muted-foreground">{cert.issuer}</div>
                      <div className="text-sm text-muted-foreground">{cert.year}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Contact Card */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Button className="w-full" size="lg">
              <MessageCircle className="mr-2 h-4 w-4" />
              메시지 보내기
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              프로젝트 제안하기
            </Button>
            <div className="flex space-x-2">
              <Button variant="ghost" className="flex-1">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="flex-1">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>통계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">완료 프로젝트</span>
              <span className="font-medium">{freelancer.completedProjects}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">재고용률</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">정시 완료율</span>
              <span className="font-medium">98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">응답 시간</span>
              <span className="font-medium">{freelancer.responseTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Similar Freelancers */}
        <Card>
          <CardHeader>
            <CardTitle>비슷한 프리랜서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`/generic-placeholder-graphic.png?height=40&width=40`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">프리랜서 {i}</div>
                  <div className="text-xs text-muted-foreground">React 개발자</div>
                  <div className="flex items-center text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    4.9 (12)
                  </div>
                </div>
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
