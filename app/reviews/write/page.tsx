"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ReviewForm } from "@/components/review/review-form"
import { useRouter } from "next/navigation"

export default function WriteReviewPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (review: { rating: number; title: string; content: string }) => {
    console.log("Review submitted:", review)
    setIsSubmitted(true)
    // TODO: Submit to API
    setTimeout(() => {
      router.push("/reviews")
    }, 2000)
  }

  const handleCancel = () => {
    router.back()
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-16 px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold mb-2">리뷰가 등록되었습니다</h1>
            <p className="text-muted-foreground mb-6">소중한 후기 감사합니다. 곧 리뷰 목록으로 이동합니다.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">리뷰 작성</h1>
          <p className="text-muted-foreground">프로젝트 경험을 공유해주세요</p>
        </div>

        <ReviewForm
          projectTitle="React 기반 전자상거래 웹사이트 개발"
          recipientName="김개발"
          recipientRole="freelancer"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </main>
    </div>
  )
}
