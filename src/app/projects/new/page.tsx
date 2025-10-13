"use client";

import { useCreateProject } from "@/global/api/useProjectQuery";
import { toast } from "@/global/hooks/useToast";
import { ProjectWriteReqBody } from "@/global/types/project.types";

import { useRouter } from "next/navigation";

import { ProjectForm } from "./_components/ProjectFrom";

export default function ProjectWritePage() {
  const router = useRouter();
  const { mutate } = useCreateProject();
  const handleCancel = () => {
    router.back();
  };
  const handleSubmit = (param: ProjectWriteReqBody) => {
    mutate(
      { ...param },
      {
        onSuccess: (res) => {
          router.replace(`/projects/${res.data.id}`);
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
          <h1 className="text-3xl font-bold mb-2">프로젝트</h1>
          <p className="text-muted-foreground">필요한 전문가를 찾아보세요</p>
        </div>
        <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </main>
    </div>
  );
}
