"use client";

import { useCreateFreelancer } from "@/global/api/useFreelancerQuery";
import { toast } from "@/global/hooks/useToast";
import { FreelancerWriteReqBody } from "@/global/types/freelancer.types";

import { useRouter } from "next/navigation";

import { FreelancerForm } from "./_components/FreelancerForm";

export default function FreelancerWritePage() {
  const router = useRouter();
  const { mutate } = useCreateFreelancer();
  const handleCancel = () => {
    router.back();
  };
  const handleSubmit = (param: FreelancerWriteReqBody) => {
    mutate(
      { ...param },
      {
        onSuccess: (res) => {
          router.replace(`/freelancers/${res.data.id}`);
        },
        onError: (res) => {
          toast({
            title: "실패",
            description: res.message,
          });
        },
      },
    );
  };

  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">프리랜서</h1>
          <p className="text-muted-foreground">
            누군가에게 필요한 전문가가 되어보세요
          </p>
        </div>
        <FreelancerForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}
