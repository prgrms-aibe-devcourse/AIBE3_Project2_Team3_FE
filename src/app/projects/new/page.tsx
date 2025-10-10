"use client";

import { useRouter } from "next/navigation";

import { ProjectForm } from "./_components/ProjectFrom";

export default function ProjectWritePage() {
  const router = useRouter();
  const handleCancel = () => {
    router.back();
  };
  return (
    <div className="min-h-screen">
      <main className="container py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">프로젝트</h1>
          <p className="text-muted-foreground">필요한 전문가를 찾아보세요</p>
        </div>
        <ProjectForm onSubmit={null} onCancel={handleCancel} />
      </main>
    </div>
  );
}
