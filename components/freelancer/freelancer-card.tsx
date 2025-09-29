import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"

interface FreelancerCardProps {
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
    isOnline: boolean
    isFavorited?: boolean
  }
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={freelancer.avatar || "/placeholder.svg"} />
                <AvatarFallback>{freelancer.name[0]}</AvatarFallback>
              </Avatar>
              {freelancer.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <Link href={`/freelancers/${freelancer.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">{freelancer.name}</h3>
              </Link>
              <p className="text-muted-foreground text-sm mb-2">{freelancer.title}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{freelancer.rating}</span>
                  <span className="text-muted-foreground ml-1">({freelancer.reviewCount})</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {freelancer.location}
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Heart className={`h-4 w-4 ${freelancer.isFavorited ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-3">{freelancer.description}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {freelancer.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {freelancer.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">완료 프로젝트</div>
            <div className="font-medium">{freelancer.completedProjects}개</div>
          </div>
          <div>
            <div className="text-muted-foreground">응답 시간</div>
            <div className="font-medium flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {freelancer.responseTime}
            </div>
          </div>
        </div>

        {/* Hourly Rate */}
        <div className="text-lg font-semibold text-primary">{freelancer.hourlyRate}</div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button className="flex-1" asChild>
            <Link href={`/freelancers/${freelancer.id}`}>프로필 보기</Link>
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
