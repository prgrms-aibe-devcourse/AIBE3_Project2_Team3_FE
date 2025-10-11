"use client";

import {
  useListChatMessage,
  useSendChatMessage,
} from "@/global/api/useChatQuery";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { toast } from "@/global/hooks/useToast";
import { formatChatTime } from "@/global/lib/utils";
import { ChatMessageDto } from "@/global/types/chat.types";
import { useEffect, useMemo, useRef, useState } from "react";

import { MoreVertical, Paperclip, Phone, Send, Video } from "lucide-react";

interface ChatWindowProps {
  selectedChatId: number;
}

export function ChatWindow({ selectedChatId }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { mutate } = useSendChatMessage(selectedChatId);

  // 스크롤 컨테이너/센티넬
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

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
    // bottom sentinel로 스크롤
    bottomSentinelRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

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

  // 메시지 전송(샘플)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = newMessage.trim();
    if (!body) return;
    // 1) 서버 전송
    // const res = await sendMessage(selectedChatId, body);
    mutate(
      { content: body },
      {
        onSuccess: (res) => {
          setNewMessage("");
          scrollToBottom(true);
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
    <Card className="h-full flex flex-col">
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
        {/* 상단 센티넬 (보이면 과거 로드) */}
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

        {messages.map((message) => {
          const isMe = false; // message.senderId === myId
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] ${isMe ? "order-2" : "order-1"}`}>
                <div
                  className={`rounded-lg px-4 py-2 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                  {formatChatTime(message.createdDate)}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 하단 센티넬 (맨 아래로 스크롤할 때 사용) */}
        <div ref={bottomSentinelRef} />
      </CardContent>

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
