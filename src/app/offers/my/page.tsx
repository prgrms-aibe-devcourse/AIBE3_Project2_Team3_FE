"use client";

import { useCreateChatRoom } from "@/global/api/useChatQuery";
import {
  useListMyOffer,
  useListReceivedOffer,
} from "@/global/api/useOfferQuery";
import LoadingScreen from "@/global/components/loading/loading";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { toast } from "@/global/hooks/useToast";
import { useMyOfferListStore } from "@/global/stores/useMyOfferListStore";
import { useReceivedOfferListStore } from "@/global/stores/useReceivedOfferListStore";
import { OfferWithUserDto } from "@/global/types/offer.types";
import { useState } from "react";

import { useRouter } from "next/navigation";

import OfferRow from "./_components/OfferRow";

export default function MyOffersPage() {
  const [tab, setTab] = useState<"my" | "received">("my");
  const myQ = useListMyOffer(tab === "my");
  const rcQ = useListReceivedOffer(tab === "received");
  const { mutate: createChatRoom } = useCreateChatRoom();

  const router = useRouter();

  const data = tab === "my" ? myQ.data : rcQ.data;
  const isLoading = tab === "my" ? myQ.isLoading : rcQ.isLoading;

  // 페이지네이션: 탭별 store 사용
  const { page: myPage, setPage: setMyPage } = useMyOfferListStore();
  const { page: rcPage, setPage: setRcPage } = useReceivedOfferListStore();

  const handleChat = async (id: number, title: string) => {
    createChatRoom(
      {
        roomName: `${title} #${id}` || `제안관리 채팅방 #${id}`,
        inviteeIds: [],
        offerId: id,
        applicationId: undefined,
      },
      {
        onSuccess: (res) => {
          const roomId = res.data.id;
          toast({
            title: "채팅 연결 성공",
            description: "채팅방으로 이동합니다.",
            open: true,
          });
          // 채팅방으로 이동
          router.push(`/chat/${roomId}`);
        },
        onError: () => {
          toast({
            title: "채팅 연결 실패",
            description: "서버와 통신 중 오류가 발생했습니다.",
            open: true,
          });
        },
      },
    );
  };

  if (!data)
    return (
      <LoadingScreen
        message="데이터를 불러오는 중입니다"
        tips={["잠시만 기다려 주세요"]}
      />
    );
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">내 제안 관리</div>
        <div className="flex gap-2">
          <Button
            variant={tab === "my" ? "default" : "outline"}
            onClick={() => setTab("my")}
          >
            내가 제안한 목록
          </Button>
          <Button
            variant={tab === "received" ? "default" : "outline"}
            onClick={() => setTab("received")}
          >
            내가 받은 목록
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {tab === "my" ? "내가 제안한 목록" : "내가 제안받은 목록"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y">
            {isLoading ? (
              <div>로딩중…</div>
            ) : (
              <div className="flex flex-col">
                {data?.content?.map((it: OfferWithUserDto, i) => (
                  <OfferRow
                    key={it.id}
                    item={it}
                    tab={tab}
                    index={
                      data.page.totalElements -
                      i -
                      data.page.page * data.page.size
                    }
                    onChat={() => handleChat(it.id, it.postTitle)}
                  />
                ))}
              </div>
            )}

            {!isLoading && data?.content?.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                목록이 비어있습니다.
              </div>
            )}
          </div>

          <div className="text-center pt-8">
            {/* 페이지네이션 */}
            {!!data && (
              <div className="text-center pt-8">
                <PaginationBar
                  pageIndex={tab === "my" ? myPage : rcPage}
                  pageCount={data.page.totalPages}
                  onPageIndexChange={tab === "my" ? setMyPage : setRcPage}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
