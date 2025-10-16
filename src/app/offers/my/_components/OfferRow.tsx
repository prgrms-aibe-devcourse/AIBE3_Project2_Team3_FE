"use client";

import ReviewCreateDialog from "@/app/applications/my/_components/ReviewDialog";
import ReviewListDialog from "@/app/applications/my/_components/ReviewListDialog";
import { useModifyOfferStatus } from "@/global/api/useOfferQuery";
import { DealStatus, StatusBadge } from "@/global/components/deals/StatusBadge";
import { Button } from "@/global/components/ui/button";
import { DEAL_STATUS_MAP } from "@/global/consts";
import { toast } from "@/global/hooks/useToast";
import { OfferWithUserDto } from "@/global/types/offer.types";
import { format } from "date-fns";

export default function OfferRow({
  item,
  index,
  tab,
  onChat,
  onReviewSubmitted,
}: {
  item: OfferWithUserDto;
  index: number;
  tab: string;
  onChat?: () => void;
  onReviewSubmitted?: () => void;
}) {
  const { mutate: modifyStatusMutate } = useModifyOfferStatus(item.id);
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
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="min-w-0">
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
            제안일:{" "}
            <span className="font-medium text-foreground">
              {format(item.createdDate, "yyyy-MM-dd")}
            </span>
          </span>
          <span>
            구매한 품목 갯수:{" "}
            <span className="font-medium text-foreground">{item.amount}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {["ACCEPTED", "COMPLETED"].includes(item.status) && (
          <Button size="sm" onClick={onChat}>
            채팅
          </Button>
        )}
        {tab == "my" && item.status === "ACCEPTED" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleModifyStatus("COMPLETED")}
          >
            완료
          </Button>
        )}
        {tab == "my" && item.status === "COMPLETED" && (
          <ReviewCreateDialog
            postId={item.postId}
            postTitle={item.postTitle}
            onSubmitted={onReviewSubmitted}
          />
        )}
        {tab === "received" && item.status === "COMPLETED" && (
          <ReviewListDialog
            postId={item.postId}
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
