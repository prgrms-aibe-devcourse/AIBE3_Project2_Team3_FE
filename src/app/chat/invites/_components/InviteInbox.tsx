"use client";

import { useFetchMe } from "@/global/api/useAuthQuery";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type InviteItem = {
  id: number; // 초대 ID (엔드포인트에는 사용하지 않음)
  roomId: number; // ✅ 수락/거절에 사용할 값
  roomName: string;
  inviterName: string;
  createdDate: string;
  invitedDate: string;
};

async function fetchInvites(): Promise<InviteItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/invites`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error("초대 목록 조회 실패");
  const body = await res.json();
  return body.data ?? body;
}

// ✅ roomId만 받도록 단순화
async function acceptInvite(roomId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/rooms/${roomId}/invites/accept`,
    { method: "POST", credentials: "include" },
  );
  if (!res.ok) throw new Error("수락 실패");
}

async function refuseInvite(roomId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/rooms/${roomId}/invites/refuse`,
    { method: "POST", credentials: "include" },
  );
  if (!res.ok) throw new Error("거절 실패");
}

export function InviteInbox() {
  const qc = useQueryClient();
  const { data: me, isLoading: meLoading, isError: meError } = useFetchMe();
  const userId = me?.data?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chat", "invites", userId],
    queryFn: fetchInvites,
    enabled: !!userId && !meLoading && !meError,
    staleTime: 30_000,
  });

  const acceptMut = useMutation({
    mutationFn: acceptInvite, // (roomId: number)
    onSuccess: () => {
      toast({ title: "수락 완료", description: "채팅방에 참여했습니다." });
      qc.invalidateQueries({ queryKey: ["chat", "invites", userId] });
      qc.invalidateQueries({ queryKey: ["chat", "room", "list"] });
    },
    onError: (e: any) =>
      toast({
        title: "실패",
        description: e?.message ?? "처리에 실패했습니다.",
      }),
  });

  const declineMut = useMutation({
    mutationFn: refuseInvite, // (roomId: number)
    onSuccess: () => {
      toast({ title: "거절 완료", description: "초대를 거절했습니다." });
      qc.invalidateQueries({ queryKey: ["chat", "invites", userId] });
    },
    onError: (e: any) =>
      toast({
        title: "실패",
        description: e?.message ?? "처리에 실패했습니다.",
      }),
  });

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

        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <div className="text-muted-foreground">받은 초대가 없습니다.</div>
        )}

        {(data ?? []).map((inv, idx) => (
          <div key={inv.id}>
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{inv.roomName}</div>
                <div className="text-sm text-muted-foreground">
                  초대한 사람: {inv.inviterName} · 받은 시각:{" "}
                  {new Date(inv.invitedDate).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                {/* ✅ roomId를 넘겨야 함 */}
                <Button
                  size="sm"
                  onClick={() => acceptMut.mutate(inv.roomId)}
                  disabled={acceptMut.isPending || declineMut.isPending}
                >
                  수락
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => declineMut.mutate(inv.roomId)}
                  disabled={acceptMut.isPending || declineMut.isPending}
                >
                  거절
                </Button>
              </div>
            </div>
            {idx < data!.length - 1 && <Separator className="my-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
