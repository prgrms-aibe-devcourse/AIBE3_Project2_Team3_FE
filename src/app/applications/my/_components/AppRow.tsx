import { Button } from "@/global/components/ui/button";
import { ApplicationDto } from "@/global/types/application.types";

export default function ApplicationRow({
  item,
  onAccept,
  onReject,
  onChat,
}: {
  item: ApplicationDto;
  onAccept?: () => void;
  onReject?: () => void;
  onChat?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <div className="font-medium">
          #{item.id} · {item.postType}
        </div>
        <div className="text-sm text-muted-foreground">{item.content}</div>
      </div>
      <div className="flex gap-2">
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
