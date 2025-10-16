"use client";

import {
  useDetailFreelancer,
  useModifyFreelancer,
} from "@/global/api/useFreelancerQuery";
import { toast } from "@/global/hooks/useToast";
import { use } from "react";

import { useRouter } from "next/navigation";

import { FreelancerForm } from "../../_components/FreelancerForm";

export default function FreelancerEditPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: freelancer } = useDetailFreelancer(id);
  const { mutate } = useModifyFreelancer(id);
  const handleCancel = () => {
    router.back();
  };
  const handleSubmit = (formData: FormData) => {
    mutate(formData, {
      onSuccess: (res) => {
        router.replace(`/freelancers/${res.data.id}`);
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
          <h1 className="text-3xl font-bold mb-2">프리랜서 수정</h1>
          <p className="text-muted-foreground">
            누군가에게 필요한 전문가가 되어보세요
          </p>
        </div>
        <FreelancerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={freelancer}
        />
      </main>
    </div>
  );
}
