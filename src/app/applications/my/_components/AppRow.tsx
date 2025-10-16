"use client";

import {
  useModifyAppStatus,
  useRemoveApp,
} from "@/global/api/useApplicationQuery";
import { DealStatus, StatusBadge } from "@/global/components/deals/StatusBadge";
import { ConfirmDelete } from "@/global/components/dialog/ConfirmDeleteDialog";
import { Button } from "@/global/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/global/components/ui/tooltip";
import { DEAL_STATUS_MAP } from "@/global/consts";
import { toast } from "@/global/hooks/useToast";
import { formatCustomDuration } from "@/global/lib/utils";
import { ApplicationWithUserDto } from "@/global/types/application.types";
import { format } from "date-fns";

import { useRouter } from "next/navigation";

import ReviewDialog from "./ReviewDialog";
import ReviewListDialog from "./ReviewListDialog";

export default function ApplicationRow({
  item,
  index,
  tab,
  onChat,
  onReviewSubmitted,
}: {
  item: ApplicationWithUserDto;
  index: number;
  tab: string;
  onChat?: () => void;
  onReviewSubmitted?: () => void;
}) {
  const router = useRouter();
  const { mutate: modifyStatusMutate } = useModifyAppStatus(item.id);
  const removeMut = useRemoveApp();
  const handleModifyStatus = (status: DealStatus) => {
    modifyStatusMutate(
      { status },
      {
        onSuccess: () => {
          toast({
            title: "성공",
            description: `${DEAL_STATUS_MAP[status]}되었습니다.`,
          });
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
  const isLong = (item.content?.length ?? 0) > 120;
  return (
    <div className="flex items-center justify-between border-b py-4 space-x-2">
      <div>
        <div className="flex space-x-2">
          <StatusBadge status={item.status as DealStatus} />
          <div className="font-medium">
            #{index} · {item.postTitle}
          </div>
        </div>
        {tab == "received" && (
          <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
            <span>
              작성자:{" "}
              <span className="font-medium text-foreground">
                {item.userNickname}
              </span>
            </span>
          </div>
        )}
        <div className="text-sm text-muted-foreground flex gap-4 flex-wrap">
          <span>
            지원일:{" "}
            <span className="font-medium text-foreground">
              {format(item.createdDate, "yyyy-MM-dd")}
            </span>
          </span>
          <span>
            지원한 희망 기간:{" "}
            <span className="font-medium text-foreground">
              {formatCustomDuration(0, item.period)}
            </span>
          </span>
          <span>
            지원한 희망 급여 :{" "}
            <span className="font-medium text-foreground">
              {item.salary.toLocaleString()}원
            </span>
          </span>
        </div>
        <div className="mt-1 min-w-0 border">
          {isLong ? (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>{item.content}</TooltipTrigger>
                <TooltipContent className="max-w-[520px] whitespace-pre-wrap break-words">
                  {item.content}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            item.content
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {tab == "my" && item.status === "PENDING" && (
          <>
            <Button
              size="sm"
              onClick={() =>
                router.replace(`/applications/${item.postId}/edit/${item.id}`)
              }
            >
              수정
            </Button>
            <ConfirmDelete
              title="지원 삭제"
              description="지원한 내역이 삭제됩니다."
              onConfirm={async () => {
                await removeMut.mutateAsync(item.id);
              }}
            />
          </>
        )}
        {tab == "received" && item.status === "PENDING" && (
          <>
            <Button size="sm" onClick={() => handleModifyStatus("ACCEPTED")}>
              수락
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleModifyStatus("REJECTED")}
            >
              거절
            </Button>
          </>
        )}
        {["ACCEPTED", "COMPLETED"].includes(item.status) && (
          <Button size="sm" onClick={onChat}>
            채팅
          </Button>
        )}
        {tab == "received" && item.status === "ACCEPTED" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleModifyStatus("COMPLETED")}
          >
            완료
          </Button>
        )}
        {tab == "my" && item.status === "COMPLETED" && (
          <ReviewDialog
            postId={item.postId}
            postTitle={item.postTitle}
            onSubmitted={onReviewSubmitted}
            trigger={
              <Button size="sm" variant="outline">
                리뷰 작성
              </Button>
            }
          />
        )}
        {tab === "received" && item.status === "COMPLETED" && (
          <ReviewListDialog
            projectId={item.postId}
            trigger={
              <Button size="sm" variant="secondary">
                리뷰 확인
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
