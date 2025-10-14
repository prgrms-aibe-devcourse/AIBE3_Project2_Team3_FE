"use client";

import { ConfirmDelete } from "@/app/admin/_components/ConfirmDeleteDialog";
import { useRemoveFreelancer } from "@/global/api/useFreelancerQuery";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { FreelancerDto } from "@/global/types/freelancer.types";

import { useRouter } from "next/navigation";

export default function FreelancerRow({
  item,
  onDeleted,
}: {
  item: FreelancerDto;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const removeMut = useRemoveFreelancer(item.id);

  const salaryText =
    typeof item.salary === "number" ? `${item.salary.toLocaleString()}원` : "-";
  const periodText = typeof item.period === "number" ? `${item.period}일` : "-";

  return (
    <div className="w-full border rounded-xl p-4 md:p-5 bg-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* 좌측: 본문 */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
            {!item.isViewed && <Badge variant="secondary">비공개</Badge>}
          </div>

          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              비용:{" "}
              <span className="font-medium text-foreground">{salaryText}</span>
            </span>
            <span>
              기간:{" "}
              <span className="font-medium text-foreground">{periodText}</span>
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

          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.content}
          </p>
        </div>

        {/* 우측: 액션 */}
        <div className="shrink-0 flex md:flex-col gap-2 self-stretch md:self-start">
          <Button
            variant="outline"
            onClick={() => router.push(`/freelancers/${item.id}/edit`)}
          >
            수정
          </Button>
          <ConfirmDelete
            title="프리랜서 글 삭제"
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
