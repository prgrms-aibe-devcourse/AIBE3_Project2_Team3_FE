"use client";

import { ConfirmDelete } from "@/app/admin/_components/ConfirmDeleteDialog";
import { useRemoveFreelancer } from "@/global/api/useFreelancerQuery";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { formatCustomDuration } from "@/global/lib/utils";
import { FreelancerDto } from "@/global/types/freelancer.types";

import { useRouter } from "next/navigation";

export default function FreelancerRow({
  freelancer,
  onDeleted,
}: {
  freelancer: FreelancerDto;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const removeMut = useRemoveFreelancer(freelancer.id);

  return (
    <div className="w-full border rounded-xl p-4 md:p-5 bg-card">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        {/* 좌측: 본문 */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg line-clamp-1">
              {freelancer.title}
            </h3>
            {!freelancer.isViewed && <Badge variant="secondary">비공개</Badge>}
          </div>

          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              비용:{" "}
              <span className="font-medium text-foreground">
                {freelancer.salary.toLocaleString()}
              </span>
            </span>
            <span>
              기간:{" "}
              <span className="font-medium text-foreground">
                {formatCustomDuration(0, freelancer.period)}
              </span>
            </span>
            {freelancer.modifiedDate && (
              <span>
                수정:{" "}
                <span className="text-foreground">
                  {new Date(freelancer.modifiedDate).toLocaleString()}
                </span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {freelancer.categories.slice(0, 3).map((c) => (
              <Badge key={`c-${c.id}`} variant="outline">
                #{c.name}
              </Badge>
            ))}
            {freelancer.categories.length > 3 && (
              <Badge variant="outline">
                +{freelancer.categories.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {freelancer.regions.slice(0, 3).map((r) => (
              <Badge key={`r-${r.id}`} variant="outline">
                {r.name}
              </Badge>
            ))}
            {freelancer.regions.length > 3 && (
              <Badge variant="outline">+{freelancer.regions.length - 3}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {freelancer.skills.slice(0, 6).map((s) => (
              <Badge key={`s-${s.id}`} variant="secondary">
                {s.name}
              </Badge>
            ))}
            {freelancer.skills.length > 6 && (
              <Badge variant="secondary">+{freelancer.skills.length - 6}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {freelancer.content}
          </p>
        </div>

        {/* 우측: 액션 */}
        <div className="shrink-0 flex md:flex-col gap-2 self-stretch md:self-start">
          <Button
            variant="outline"
            onClick={() => router.push(`/freelancers/${freelancer.id}/edit`)}
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
