"use client";

import {
  useDetailProject,
  useModifyProject,
} from "@/global/api/useProjectQuery";
import { toast } from "@/global/hooks/useToast";
import { ProjectWriteReqBody } from "@/global/types/project.types";
import { use } from "react";

import { useRouter } from "next/navigation";

import { ProjectForm } from "../../_components/ProjectForm";

export default function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: project } = useDetailProject(id);
  const { mutate } = useModifyProject(id);
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
          <h1 className="text-3xl font-bold mb-2">프로젝트 수정</h1>
          <p className="text-muted-foreground">필요한 전문가를 찾아보세요</p>
        </div>
        <ProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={project}
        />
      </main>
    </div>
  );
}
