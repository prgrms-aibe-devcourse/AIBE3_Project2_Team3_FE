"use client"

import { useState } from "react"
import { ReviewCard } from "./review-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter } from "lucide-react"

interface ReviewListProps {
  reviews: Array<{
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
  }>
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [filterRole, setFilterRole] = useState("all")

  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterRating !== "all" && review.rating !== Number.parseInt(filterRating)) return false
      if (filterRole !== "all" && review.author.role !== filterRole) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">필터 및 정렬</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="highest">평점 높은순</SelectItem>
              <SelectItem value="lowest">평점 낮은순</SelectItem>
              <SelectItem value="helpful">도움됨순</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="평점" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 평점</SelectItem>
              <SelectItem value="5">
                <div className="flex items-center">
                  5 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </SelectItem>
              <SelectItem value="4">
                <div className="flex items-center">
                  4 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </SelectItem>
              <SelectItem value="3">
                <div className="flex items-center">
                  3 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </SelectItem>
              <SelectItem value="2">
                <div className="flex items-center">
                  2 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </SelectItem>
              <SelectItem value="1">
                <div className="flex items-center">
                  1 <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="역할" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 역할</SelectItem>
              <SelectItem value="client">클라이언트</SelectItem>
              <SelectItem value="freelancer">프리랜서</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">총 {filteredAndSortedReviews.length}개의 리뷰</div>

      {/* Reviews */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">리뷰가 없습니다</h3>
          <p className="text-muted-foreground">선택한 조건에 맞는 리뷰가 없습니다.</p>
        </div>
      )}

      {/* Load More */}
      {filteredAndSortedReviews.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="bg-transparent">
            더 많은 리뷰 보기
          </Button>
        </div>
      )}
    </div>
  )
}
