"use client";

import { useRemoveProject } from "@/global/api/useProjectQuery";
import { ConfirmDelete } from "@/global/components/dialog/ConfirmDeleteDialog";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { ProjectDto } from "@/global/types/project.types";
import { format } from "date-fns";

import { useRouter } from "next/navigation";

export default function ProjectRow({
  project,
  onDeleted,
}: {
  project: ProjectDto;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const removeMut = useRemoveProject(project.id);

  const salaryText =
    typeof project.salary === "number"
      ? `${project.salary.toLocaleString()}원`
      : "-";
  const deadlineShort = project.deadlineDate
    ? new Date(project.deadlineDate).toLocaleDateString()
    : "-";

  return (
    <div className="w-full border rounded-xl p-4 md:p-5 bg-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* 좌측: 제목/메타/태그/내용 */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg line-clamp-1">
              {project.title}
            </h3>
            {!project.isViewed && <Badge variant="secondary">비공개</Badge>}
            {project.employmentType && (
              <Badge>
                {project.employmentType == "onsite" ? "상주" : "외주"}
              </Badge>
            )}
            {project.hirerType && (
              <Badge variant="outline">
                {project.hirerType == "individual" ? "개인" : "법인"}
              </Badge>
            )}
          </div>

          {/* 메타 */}
          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              공고 마감:{" "}
              <span className="font-medium text-foreground">
                {format(project.deadlineDate, "yyyy-MM-dd")}
              </span>
            </span>
            <span>
              프로젝트 시작일:{" "}
              <span className="font-medium text-foreground">
                {format(project.startedDate, "yyyy-MM-dd")}
              </span>
            </span>
            <span>
              프로젝트 마감일:{" "}
              <span className="font-medium text-foreground">
                {format(project.endedDate, "yyyy-MM-dd")}
              </span>
            </span>
          </div>
          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              예산:{" "}
              <span className="font-medium text-foreground">
                {project.salary.toLocaleString()}
              </span>
            </span>
            {project.modifiedDate && (
              <span>
                수정:{" "}
                <span className="text-foreground">
                  {new Date(project.modifiedDate).toLocaleString()}
                </span>
              </span>
            )}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-1.5">
            {project.categories.slice(0, 3).map((c) => (
              <Badge key={`c-${c.id}`} variant="outline">
                #{c.name}
              </Badge>
            ))}
            {project.categories.length > 3 && (
              <Badge variant="outline">+{project.categories.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.regions.slice(0, 3).map((r) => (
              <Badge key={`r-${r.id}`} variant="outline">
                {r.name}
              </Badge>
            ))}
            {project.regions.length > 3 && (
              <Badge variant="outline">+{project.regions.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.skills.slice(0, 6).map((s) => (
              <Badge key={`s-${s.id}`} variant="secondary">
                {s.name}
              </Badge>
            ))}
            {project.skills.length > 6 && (
              <Badge variant="secondary">+{project.skills.length - 6}</Badge>
            )}
          </div>

          {/* 내용 한 줄 요약 */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.content}
          </p>
        </div>

        {/* 우측: 액션 */}
        <div className="shrink-0 flex md:flex-col gap-2 self-stretch md:self-start">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${project.id}/edit`)}
          >
            수정
          </Button>
          <ConfirmDelete
            title="프로젝트 삭제"
            description="삭제 후 복구할 수 없습니다."
            onConfirm={async () => {
              await removeMut.mutateAsync();
              onDeleted();
            }}
          >
            삭제
          </ConfirmDelete>
        </div>
      </div>
    </div>
  );
}
