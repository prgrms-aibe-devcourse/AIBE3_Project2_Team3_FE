import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star } from "lucide-react"

interface ReviewStatsProps {
  stats: {
    totalReviews: number
    averageRating: number
    ratingDistribution: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
  }
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const { totalReviews, averageRating, ratingDistribution } = stats

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
      />
    ))
  }

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 통계</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center mb-2">{renderStars(averageRating)}</div>
          <p className="text-sm text-muted-foreground">{totalReviews}개의 리뷰</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress
                value={getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">
                {ratingDistribution[rating as keyof typeof ratingDistribution]}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(((ratingDistribution[4] + ratingDistribution[5]) / totalReviews) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">긍정적 리뷰</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {Math.round((ratingDistribution[5] / totalReviews) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">5점 리뷰</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
