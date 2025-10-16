"use client";

import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/global/components/ui/select";
import { Separator } from "@/global/components/ui/separator";
import { Textarea } from "@/global/components/ui/textarea";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AlertCircle, ArrowLeft, Send } from "lucide-react";

export default function NewQuestionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TODO: API 연동 후 실제 카테고리 데이터로 교체
  const categories = [
    { value: "account", label: "계정 관리" },
    { value: "project", label: "프로젝트 관리" },
    { value: "payment", label: "결제/정산" },
    { value: "technical", label: "기술 지원" },
    { value: "portfolio", label: "포트폴리오" },
    { value: "evaluation", label: "평가 시스템" },
    { value: "general", label: "일반 문의" },
    { value: "other", label: "기타" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "제목은 최소 5자 이상 입력해주세요.";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "제목은 100자 이하로 입력해주세요.";
    }

    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    if (!formData.content.trim()) {
      newErrors.content = "문의 내용을 입력해주세요.";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "문의 내용은 최소 10자 이상 입력해주세요.";
    } else if (formData.content.trim().length > 2000) {
      newErrors.content = "문의 내용은 2000자 이하로 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API 연동
      console.log("문의 등록:", formData);

      // 임시 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시 상세 페이지로 이동 (임시로 ID 1 사용)
      router.push("/questions/1");
    } catch (error) {
      console.error("문의 등록 실패:", error);
      // TODO: 에러 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 헤더 */}
      <div className="mb-6">
        <Link href="/questions">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            문의사항 목록으로 돌아가기
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">새 문의사항 작성</h1>
        <p className="text-muted-foreground mt-2">
          궁금한 점이나 문제가 있으시면 언제든 문의해주세요. 최대한 빠르게
          답변드리겠습니다.
        </p>
      </div>

      {/* 안내 사항 */}
      <Card className="mb-6 border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">
                문의하기 전에 확인해주세요
              </p>
              <ul className="text-blue-800 space-y-1">
                <li>• 자주 묻는 질문(FAQ)에서 먼저 답변을 찾아보세요</li>
                <li>• 구체적이고 명확한 제목과 내용으로 작성해주세요</li>
                <li>
                  • 관련 스크린샷이나 오류 메시지가 있다면 함께 첨부해주세요
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 문의 작성 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>문의 내용</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="문의사항의 제목을 입력해주세요 (5-100자)"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100자
              </p>
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="category">
                카테고리 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger
                  className={errors.category ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="문의 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* 문의 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content">
                문의 내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="문의하실 내용을 자세히 작성해주세요.&#10;&#10;• 문제가 발생한 상황&#10;• 기대했던 결과&#10;• 실제 발생한 결과&#10;• 관련 스크린샷이나 오류 메시지 (있는 경우)&#10;&#10;구체적으로 작성해주실수록 정확한 답변을 드릴 수 있습니다."
                className={`min-h-[200px] resize-none ${errors.content ? "border-red-500" : ""}`}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.content.length}/2000자
              </p>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/questions">
                <Button type="button" variant="outline">
                  취소
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  "등록 중..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    문의 등록
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
