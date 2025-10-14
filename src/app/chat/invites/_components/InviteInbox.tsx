// src/app/chat/invites/_components/InviteInbox.tsx
"use client";

import { useFetchMe } from "@/global/api/useAuthQuery";
import {
  useAcceptInvite,
  useInviteInbox,
  useRefuseInvite,
} from "@/global/api/useChatQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

// src/app/chat/invites/_components/InviteInbox.tsx

type InviteItem = {
  id: number;
  roomId: number;
  roomName: string;
  inviterName: string;
  createdDate: string;
  invitedDate: string;
};

export function InviteInbox() {
  const qc = useQueryClient();
  const { data: me, isLoading: meLoading, isError: meError } = useFetchMe();
  const userId = me?.data?.id;

  const { data, isLoading, isError, error } = useInviteInbox(userId);
  const { mutate: acceptMut, isPending: accepting } = useAcceptInvite();
  const { mutate: declineMut, isPending: declining } = useRefuseInvite();

  if (meLoading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>받은 초대</CardTitle>
        </CardHeader>
        <CardContent>유저 정보를 불러오는 중…</CardContent>
      </Card>
    );
  }
  if (meError || !userId) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>받은 초대</CardTitle>
        </CardHeader>
        <CardContent className="text-red-600">
          로그인 정보를 확인할 수 없습니다.
        </CardContent>
      </Card>
    );
  }

  const list: InviteItem[] = (data ?? []) as InviteItem[];

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>받은 초대</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <div>불러오는 중…</div>}
        {isError && (
          <div className="text-red-600">{(error as Error)?.message}</div>
        )}
        {!isLoading && !isError && list.length === 0 && (
          <div className="text-muted-foreground">받은 초대가 없습니다.</div>
        )}

        {list.map((inv, idx) => (
          <div key={inv.id ?? `${inv.roomId}-${idx}`}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{inv.roomName}</div>
                <div className="text-sm text-muted-foreground">
                  초대한 사람: {inv.inviterName} · 받은 시각:{" "}
                  {new Date(inv.invitedDate).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    acceptMut(inv.roomId, {
                      onSuccess: () => {
                        toast({
                          title: "수락 완료",
                          description: "채팅방에 참여했습니다.",
                        });
                        qc.invalidateQueries({
                          queryKey: ["chat", "invites", userId],
                        });
                        qc.invalidateQueries({ queryKey: ["room", "list"] });
                      },
                      onError: (e: any) =>
                        toast({
                          title: "실패",
                          description: e?.message ?? "처리에 실패했습니다.",
                        }),
                    })
                  }
                  disabled={accepting || declining}
                >
                  수락
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    declineMut(inv.roomId, {
                      onSuccess: () => {
                        toast({
                          title: "거절 완료",
                          description: "초대를 거절했습니다.",
                        });
                        qc.invalidateQueries({
                          queryKey: ["chat", "invites", userId],
                        });
                      },
                      onError: (e: any) =>
                        toast({
                          title: "실패",
                          description: e?.message ?? "처리에 실패했습니다.",
                        }),
                    })
                  }
                  disabled={accepting || declining}
                >
                  거절
                </Button>
              </div>
            </div>
            {idx < list.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
