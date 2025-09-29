import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp, Flag, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    title: string
    content: string
    author: {
      name: string
      avatar?: string
      role: "client" | "freelancer"
    }
    project: {
      title: string
      category: string
    }
    createdAt: string
    helpful: number
    isHelpful?: boolean
    canEdit?: boolean
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
    ))
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{review.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium">{review.author.name}</h4>
                <Badge variant={review.author.role === "client" ? "default" : "secondary"} className="text-xs">
                  {review.author.role === "client" ? "클라이언트" : "프리랜서"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-muted-foreground">{review.createdAt}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                프로젝트: {review.project.title} • {review.project.category}
              </p>
            </div>
          </div>
          {review.canEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>수정</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">삭제</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{review.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{review.content}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-2 ${review.isHelpful ? "text-primary" : ""}`}
          >
            <ThumbsUp className={`h-4 w-4 ${review.isHelpful ? "fill-current" : ""}`} />
            <span>도움됨 ({review.helpful})</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4 mr-2" />
            신고
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
