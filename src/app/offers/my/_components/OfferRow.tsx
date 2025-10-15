import { Button } from "@/global/components/ui/button";
import { OfferDto } from "@/global/types/offer.types";

export default function OfferRow({
  item,
  onAccept,
  onReject,
  onChat,
}: {
  item: OfferDto;
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="min-w-0">
        <div className="font-medium">
          #{item.id} · {item.postType} · 제안 {item.amount.toLocaleString()}원
        </div>
        <div className="text-sm text-muted-foreground">
          게시글 ID: {item.postId}
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {item.status === "PENDING" && (
          <>
            <Button size="sm" onClick={onAccept}>
              수락
            </Button>
            <Button size="sm" variant="outline" onClick={onReject}>
              거절
            </Button>
          </>
        )}
        {item.status === "ACCEPTED" && (
          <Button size="sm" onClick={onChat}>
            채팅
          </Button>
        )}
      </div>
    </div>
  );
}
