"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { Star } from "lucide-react"

interface ReviewFormProps {
  projectTitle: string
  recipientName: string
  recipientRole: "client" | "freelancer"
  onSubmit?: (review: { rating: number; title: string; content: string; attachments: File[] }) => void
  onCancel?: () => void
}

export function ReviewForm({ projectTitle, recipientName, recipientRole, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !title.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onSubmit?.({ rating, title, content, attachments })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files])
  }

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </button>
      )
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {recipientRole === "client" ? "클라이언트" : "프리랜서"} {recipientName}님에 대한 리뷰 작성
        </CardTitle>
        <p className="text-sm text-muted-foreground">프로젝트: {projectTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>평점</Label>
            <div className="flex items-center space-x-1">{renderStars()}</div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "매우 불만족"}
                {rating === 2 && "불만족"}
                {rating === 3 && "보통"}
                {rating === 4 && "만족"}
                {rating === 5 && "매우 만족"}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">리뷰 제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="리뷰 제목을 입력하세요"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">리뷰 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="프로젝트 경험에 대해 자세히 작성해주세요..."
              rows={6}
              required
            />
            <p className="text-xs text-muted-foreground">최소 50자 이상 작성해주세요</p>
          </div>

          <div className="space-y-2">
            <Label>첨부파일 (선택사항)</Label>
            <FileUpload onFileSelect={handleFileSelect} accept="image/*,.pdf,.doc,.docx" multiple={true} maxSize={5} />
            <p className="text-xs text-muted-foreground">
              프로젝트 결과물이나 관련 자료를 첨부할 수 있습니다 (최대 5MB)
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">리뷰 작성 가이드라인</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 구체적이고 건설적인 피드백을 제공해주세요</li>
              <li>• 커뮤니케이션, 품질, 일정 준수 등을 고려해주세요</li>
              <li>• 개인적인 공격이나 부적절한 내용은 피해주세요</li>
              <li>• 정직하고 공정한 평가를 부탁드립니다</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={rating === 0 || !title.trim() || !content.trim() || content.length < 50 || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "리뷰 등록 중..." : "리뷰 등록"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
