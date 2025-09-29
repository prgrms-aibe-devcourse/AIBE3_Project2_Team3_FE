import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MapPin, Star, Heart, Eye } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    budget: string
    duration: string
    location: string
    skills: string[]
    client: {
      name: string
      avatar?: string
      rating: number
      reviewCount: number
    }
    postedAt: string
    applicants: number
    views: number
    isFavorited?: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/projects/${project.id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                {project.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{project.description}</p>
          </div>
          <Button variant="ghost" size="sm" className="ml-2">
            <Heart className={`h-4 w-4 ${project.isFavorited ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {project.duration}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {project.location}
          </div>
        </div>

        {/* Budget */}
        <div className="text-lg font-semibold text-primary">{project.budget}</div>

        {/* Client Info */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.client.avatar || "/placeholder.svg"} />
              <AvatarFallback>{project.client.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{project.client.name}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {project.client.rating} ({project.client.reviewCount})
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {project.views}
            </div>
            <div>{project.applicants}명 지원</div>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full" asChild>
          <Link href={`/projects/${project.id}`}>프로젝트 보기</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
