"use client";

import { useCreateQuestion } from "@/global/api/useQuestionQuery";
import { toast } from "@/global/hooks/useToast";
import { QuestionWriteReqBody } from "@/global/types/question.types";

import { useRouter } from "next/navigation";

import { QuestionForm } from "../_components/QuestionForm";

export default function QuestionWritePage() {
  const router = useRouter();
  const { mutate } = useCreateQuestion();

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = (param: QuestionWriteReqBody) => {
    mutate(param, {
      onSuccess: (res) => {
        router.replace(`/questions/${res.data.id}`);
      },
      onError: (res) => {
        toast({
          title: "실패",
          description: res.message,
        });
      },
    });
  };

  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">문의사항 작성</h1>
          <p className="text-muted-foreground">궁금한 사항을 문의해주세요</p>
        </div>
        <QuestionForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}
