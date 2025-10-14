"use client";

import { ConfirmDelete } from "@/app/admin/_components/ConfirmDeleteDialog";
import { useRemoveProject } from "@/global/api/useProjectQuery";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { ProjectDto } from "@/global/types/project.types";

import { useRouter } from "next/navigation";

export default function ProjectRow({
  item,
  onDeleted,
}: {
  item: ProjectDto;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const removeMut = useRemoveProject(item.id);

  const salaryText =
    typeof item.salary === "number" ? `${item.salary.toLocaleString()}원` : "-";
  const deadlineShort = item.deadlineDate
    ? new Date(item.deadlineDate).toLocaleDateString()
    : "-";

  return (
    <div className="w-full border rounded-xl p-4 md:p-5 bg-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* 좌측: 제목/메타/태그/내용 */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            {!item.isViewed && <Badge variant="secondary">비공개</Badge>}
            {item.employmentType && (
              <Badge>{item.employmentType == "onsite" ? "상주" : "외주"}</Badge>
            )}
            {item.hirerType && (
              <Badge variant="outline">
                {item.hirerType == "individual" ? "개인" : "법인"}
              </Badge>
            )}
          </div>

          {/* 메타 */}
          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              예산:{" "}
              <span className="font-medium text-foreground">{salaryText}</span>
            </span>
            <span>
              마감:{" "}
              <span className="font-medium text-foreground">
                {deadlineShort}
              </span>
            </span>
            {item.modifiedDate && (
              <span>
                수정:{" "}
                <span className="text-foreground">
                  {new Date(item.modifiedDate).toLocaleString()}
                </span>
              </span>
            )}
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-1.5">
            {item.categories.slice(0, 3).map((c) => (
              <Badge key={`c-${c.id}`} variant="outline">
                #{c.name}
              </Badge>
            ))}
            {item.categories.length > 3 && (
              <Badge variant="outline">+{item.categories.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.regions.slice(0, 3).map((r) => (
              <Badge key={`r-${r.id}`} variant="outline">
                {r.name}
              </Badge>
            ))}
            {item.regions.length > 3 && (
              <Badge variant="outline">+{item.regions.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.skills.slice(0, 6).map((s) => (
              <Badge key={`s-${s.id}`} variant="secondary">
                {s.name}
              </Badge>
            ))}
            {item.skills.length > 6 && (
              <Badge variant="secondary">+{item.skills.length - 6}</Badge>
            )}
          </div>

          {/* 내용 한 줄 요약 */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.content}
          </p>
        </div>

        {/* 우측: 액션 */}
        <div className="shrink-0 flex md:flex-col gap-2 self-stretch md:self-start">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${item.id}/edit`)}
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
