"use client";

import { useDetailProject } from "@/global/api/useProjectQuery";
import LoadingScreen from "@/global/components/loading/loading";
import { use, useCallback } from "react";

import { useRouter } from "next/navigation";

import { ApplicationFormCard } from "./_compoents/ApplicationForm";
import { ProjectInfoCard } from "./_compoents/ProjectInfoCard";

export default function ApplicationWritePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id: postId } = use(params);
  const router = useRouter();

  const { data: project, isLoading: projectLoading } = useDetailProject(postId);

  const handleSuccess = useCallback(() => {
    router.replace(`/projects/${postId}`);
  }, [router, postId]);

  const handleCancel = useCallback(() => {
    router.replace(`/projects/${postId}`);
  }, [router, postId]);

  if (projectLoading || !project) {
    return (
      <LoadingScreen
        message="데이터를 불러오는 중입니다"
        tips={["잠시만 기다려 주세요"]}
      />
    );
  }

  return (
    <div className="py-4 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProjectInfoCard project={project} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ApplicationFormCard
            projectId={postId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
