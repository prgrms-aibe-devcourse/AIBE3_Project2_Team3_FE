"use client";

import { useFetchMe } from "@/global/api/useAuthQuery";
import { chatQueryKeys, useListChatMessage } from "@/global/api/useChatQuery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { useStompRoom } from "@/global/hooks/useStompRoom";
import { formatChatTime } from "@/global/lib/utils";
import {
  ChatMessageDto,
  PagePayloadChatMessageDto,
} from "@/global/types/chat.types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Video,
} from "lucide-react";

interface ChatWindowProps {
  selectedChatId: number;
}

export function ChatWindow({ selectedChatId }: ChatWindowProps) {
  const { data: me } = useFetchMe();
  const myId = me?.data.id;

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // 스크롤 컨테이너/센티넬
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newSinceNotBottom, setNewSinceNotBottom] = useState(0);

  const needAutoScrollRef = useRef(false);

  // 무한 스크롤(위 방향): 초기엔 최신부터 한 페이지 로드, 이후엔 과거로 더 가져오기
  const {
    data,
    status,
    fetchNextPage, // 다음 = "과거" 더 로드
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useListChatMessage(selectedChatId);

  // 평탄화 + 정렬 (UI는 "오래된 → 최신" 위에서 아래로 흐르도록 권장)
  const messages: ChatMessageDto[] = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.content) ?? [];
    // createdDate 오름차순 정렬
    return flat
      .slice()
      .sort((a, b) => a.createdDate.localeCompare(b.createdDate));
  }, [data]);

  // 맨 아래 자동 스크롤 (새 메시지 도착 / 방 바뀜)
  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      if (smooth)
        bottomSentinelRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24; // 24px 여유
      setIsAtBottom(nearBottom);
      if (nearBottom) setNewSinceNotBottom(0);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // 방이 바뀌면 처음 로드 후 아래로
  useEffect(() => {
    if (status === "success") {
      // 첫 로드시 자연스럽게 아래로
      scrollToBottom(false);
    }
  }, [status, selectedChatId]);

  // 위로 스크롤 시 더 불러오기: top sentinel 관찰(루트 = 스크롤 컨테이너)
  useEffect(() => {
    if (!scrollRef.current || !topSentinelRef.current) return;

    const rootEl = scrollRef.current;
    const sentinel = topSentinelRef.current;

    let prevScrollHeight = 0;
    let prevScrollTop = 0;

    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          // prepend 시 스크롤 위치 보정 위해 현재 높이/스크롤 기억
          prevScrollHeight = rootEl.scrollHeight;
          prevScrollTop = rootEl.scrollTop;

          await fetchNextPage();

          // 새 데이터가 위에 붙었으니, 이전 대비 늘어난 만큼 scrollTop을 보정
          const newScrollHeight = rootEl.scrollHeight;
          const delta = newScrollHeight - prevScrollHeight;
          rootEl.scrollTop = prevScrollTop + delta; // 위치 유지
        }
      },
      {
        root: rootEl,
        rootMargin: "200px 0px 0px 0px", // 여유 마진
        threshold: 0.01,
      },
    );

    io.observe(sentinel);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const qc = useQueryClient();
  const onMessage = useCallback(
    (dto: ChatMessageDto) => {
      qc.setQueryData<InfiniteData<PagePayloadChatMessageDto>>(
        chatQueryKeys.chatMessageList(selectedChatId).queryKey,
        (old) => {
          // 아직 목록을 한 번도 안 불렀다면 즉석에서 첫 페이지 구성(선택)
          if (!old) {
            return {
              pageParams: [undefined],
              pages: [
                {
                  content: [dto],
                  page: {
                    page: 0,
                    size: 30,
                    totalElements: 1,
                    totalPages: 1,
                    first: true,
                    last: true,
                    hasNext: false,
                    hasPrevious: false,
                    sort: [{ property: "id", direction: "DESC" }],
                  },
                },
              ],
            };
          }

          // 중복 방지
          const exists = old.pages.some((p) =>
            p.content.some((m) => m.id === dto.id),
          );
          if (exists) return old;

          // 최신 페이지는 pages[0] (과거는 fetchNextPage로 뒤에 붙음)
          const pages = [...old.pages];
          const first = pages[0];

          pages[0] = {
            ...first,
            content: [...first.content, dto],
            page: {
              ...first.page,
              totalElements:
                (first.page?.totalElements ?? first.content.length) + 1,
            },
          };

          return { ...old, pages };
        },
      );

      if (dto.senderId === myId || isAtBottom) {
        needAutoScrollRef.current = true; // ← 예약
      }
    },
    [qc, selectedChatId, isAtBottom],
  );

  useLayoutEffect(() => {
    if (needAutoScrollRef.current) {
      needAutoScrollRef.current = false;
      scrollToBottom(true);
    }
  }, [messages.length]);

  const { send } = useStompRoom(selectedChatId, onMessage);

  // 메시지 전송(샘플)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = newMessage.trim();
    if (!body) return;
    send(body);
    setNewMessage("");

    scrollToBottom(true);
  };

  return (
    <Card className="h-full flex flex-col relative">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">채팅방 정보</div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <div ref={topSentinelRef} />

        {status === "pending" && (
          <div className="text-center text-muted-foreground py-4">
            불러오는 중…
          </div>
        )}
        {status === "error" && (
          <div className="text-center text-destructive py-4">
            메시지를 가져오지 못했어요.
          </div>
        )}

        {messages.map((m) => {
          const isMe = m.senderId === myId;

          return (
            <div
              key={m.id}
              className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {/* 상대방: 좌측 상단 아바타 */}
              {!isMe && (
                <Avatar className="h-8 w-8 mt-[2px]">
                  <AvatarImage
                    src={m.senderProfileImageUrl ?? "https://picsum.photos/200"}
                  />
                  <AvatarFallback>이미지</AvatarFallback>
                </Avatar>
              )}

              {/* 본문 영역 */}
              <div
                className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* 상대방: 말풍선 위에 닉네임 */}
                {!isMe && (
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {m.senderNickname}
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>

                <p className="text-[11px] text-muted-foreground mt-1 px-1">
                  {formatChatTime(m.createdDate)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomSentinelRef} />
      </CardContent>

      {/* 하단 점프 버튼 */}
      {!isAtBottom && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2">
          <Button
            variant="secondary"
            size="sm"
            className="pointer-events-auto shadow rounded-full px-3"
            onClick={() => scrollToBottom(true)}
          >
            <ChevronDown className="h-4 w-4 mr-1" />
            최근 메시지로
            {newSinceNotBottom > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/90 px-1 text-[11px] text-primary-foreground">
                {newSinceNotBottom}
              </span>
            )}
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
