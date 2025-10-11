"use client";

import { useListChatRoom } from "@/global/api/useChatQuery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { formatChatTimestamp } from "@/global/lib/utils";
import { useChatRoomListStore } from "@/global/stores/useChatRoomListStore";
import { ChatRoomDto } from "@/global/types/chat.types";
import { useEffect, useMemo, useRef } from "react";

import Link from "next/link";

import { MessageCircle, Search } from "lucide-react";

interface ChatListProps {
  selectedChatId?: number;
}
export function ChatList({ selectedChatId }: ChatListProps) {
  const { search, setSearch } = useChatRoomListStore((state) => state);
  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useListChatRoom();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const items: ChatRoomDto[] = useMemo(
    () => data?.pages.flatMap((p) => p.content) ?? [],
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (chat) => chat.name.toLowerCase().includes(q),
      // 1:1 DM이면 avatarPreview[0].nickname 같은 것도 포함 가능
      // || chat.avatarPreview.some(a => a.nickname.toLowerCase().includes(q))
    );
  }, [items, search]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isEmpty = filtered.length === 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          메시지
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="대화 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filtered.map((chat) => {
            const isActive = chat.id === selectedChatId;
            return (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div
                  className={[
                    "flex items-center space-x-3 p-4 transition-colors cursor-pointer",
                    isActive
                      ? "bg-muted ring-1 ring-ring hover:bg-muted/80"
                      : "hover:bg-accent",
                  ].join(" ")}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={"https://picsum.photos/200"} />
                      <AvatarFallback>이미지</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatChatTimestamp(chat.lastMessage.createdDate)}
                        </span>
                        {chat.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                          >
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        chat.unreadCount === 0
                          ? "text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {chat.lastMessage.content}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 빈 상태 */}
        {status === "success" && isEmpty && (
          <div className="text-center py-8 text-muted-foreground">
            {search ? "검색 결과가 없습니다" : "아직 대화가 없습니다"}
          </div>
        )}
        {/* 무한스크롤 sentinel */}
        <div ref={loaderRef} className="h-6" />
        {isFetchingNextPage && (
          <div className="py-3 text-center text-muted-foreground">
            더 불러오는 중…
          </div>
        )}
      </CardContent>
    </Card>
  );
}
