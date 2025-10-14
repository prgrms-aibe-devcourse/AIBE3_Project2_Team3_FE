"use client";

import { useFetchMe } from "@/global/api/useAuthQuery";
import { useListChatRoom } from "@/global/api/useChatQuery";
import { searchUsersToInvite, useInviteUsers } from "@/global/api/useChatQuery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/global/components/ui/dialog";
import { Input } from "@/global/components/ui/input";
import { ScrollArea } from "@/global/components/ui/scroll-area";
import { Separator } from "@/global/components/ui/separator";
import { formatChatTimestamp } from "@/global/lib/utils";
import { useChatRoomListStore } from "@/global/stores/useChatRoomListStore";
import type { InviteUserSummary } from "@/global/types/chat.types";
import { ChatRoomDto } from "@/global/types/chat.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Inbox, MessageCircle, Plus, Search, Users, X } from "lucide-react";

function CreateChatRoomDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: meRes, isLoading: meLoading } = useFetchMe();
  const myId = meRes?.data?.id;

  const onCreate = async () => {
    if (!name.trim()) {
      setError("채팅방 이름을 입력해 주세요");
      return;
    }
    try {
      setCreating(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/rooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ roomName: name.trim(), inviteeIds: [myId] }),
          credentials: "include",
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "채팅방 생성 실패");
      }

      const body = await res.json().catch(() => ({}));
      // 응답 스키마에 따라 아래 두 줄 중 맞는 걸로 사용
      const newId = body?.data?.id ?? body?.id; // ← 서버 응답에 맞게 조정

      setOpen(false);
      setName("");

      if (newId) {
        router.push(`/chat/${newId}`);
      } else {
        // id가 없다면 리스트 새로고침(선택)
        router.refresh?.();
      }
    } catch (e: any) {
      setError(e?.message ?? "생성 중 오류가 발생했습니다");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          + 채팅방 만들기
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>새 채팅방 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="채팅방 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void onCreate();
              }
            }}
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={onCreate}
              disabled={creating || !name.trim()}
            >
              {creating ? "생성 중…" : "생성"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
/* ─────────────────────────────────────────────
 * 초대 다이얼로그
 * ───────────────────────────────────────────── */
function InviteUsersDialog({
  chatId,
  disabled,
}: {
  chatId?: number;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<InviteUserSummary[]>([]);
  const [selected, setSelected] = useState<InviteUserSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: invite, isPending: inviting } = useInviteUsers(chatId);

  const isPicked = useCallback(
    (id: number) => selected.some((u) => u.id === id),
    [selected],
  );
  const addUser = (u: InviteUserSummary) => {
    if (isPicked(u.id)) return;
    setSelected((prev) => [...prev, u]);
  };
  const removeUser = (id: number) =>
    setSelected((prev) => prev.filter((u) => u.id !== id));

  // 검색
  const runSearch = async () => {
    try {
      setError(null);
      setIsSearching(true);
      const data = await searchUsersToInvite(q);
      setResults(data);
    } catch (e: any) {
      setError(e?.message ?? "검색 중 오류가 발생했습니다");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void runSearch();
    }
  };

  // 초대 실행
  const onInvite = async () => {
    if (!chatId) return;
    if (selected.length === 0) {
      setError("초대할 사용자를 선택해 주십시오");
      return;
    }
    try {
      setError(null);
      await invite(selected.map((u) => u.id)); // ← useInviteUsers 사용
      // 초기화
      setSelected([]);
      setQ("");
      setResults([]);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message ?? "초대에 실패했습니다");
    }
  };

  // 다이얼로그 닫힐 때 정리
  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
      setSelected([]);
      setError(null);
      setIsSearching(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          <Users className="mr-2 h-4 w-4" />
          채팅 초대
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>유저 초대</DialogTitle>
        </DialogHeader>

        {/* 검색 영역 */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="닉네임으로 검색"
              className="pl-10"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute right-1.5 top-1.5"
              onClick={runSearch}
              disabled={isSearching || !q.trim()}
            >
              검색
            </Button>
          </div>

          {/* 선택된 사용자 */}
          <div className="flex flex-wrap gap-2 min-h-9">
            {selected.map((u) => (
              <Badge
                key={u.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {u.username}
                <button
                  aria-label="remove"
                  onClick={() => removeUser(u.id)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
            {selected.length === 0 && (
              <span className="text-sm text-muted-foreground">
                선택된 사용자가 없습니다
              </span>
            )}
          </div>

          <Separator />

          {/* 검색 결과 */}
          <div>
            <div className="mb-2 text-sm text-muted-foreground">
              검색 결과 {isSearching ? "조회 중…" : `(${results.length}명)`}
            </div>
            <ScrollArea className="h-64 pr-2">
              <div className="space-y-2">
                {results.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{u.username}</div>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant={isPicked(u.id) ? "secondary" : "default"}
                      className="shrink-0"
                      onClick={() =>
                        isPicked(u.id) ? removeUser(u.id) : addUser(u)
                      }
                      aria-label={isPicked(u.id) ? "선택 해제" : "추가"}
                    >
                      {isPicked(u.id) ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
                {results.length === 0 && !isSearching && (
                  <div className="py-8 text-center text-muted-foreground">
                    결과가 없습니다
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              선택 {selected.length}명
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                닫기
              </Button>
              <Button
                type="button"
                onClick={onInvite}
                disabled={!chatId || selected.length === 0 || inviting}
              >
                {inviting ? "초대 중…" : "초대"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
 * 채팅 리스트
 * ───────────────────────────────────────────── */
interface ChatListProps {
  selectedChatId?: number;
}
export function ChatList({ selectedChatId }: ChatListProps) {
  const { search, setSearch } = useChatRoomListStore((s) => s);
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
    return items.filter((chat) => chat.name.toLowerCase().includes(q));
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            메시지
          </CardTitle>

          <Link href="/chat/invites">
            <Button variant="secondary" size="sm" className="gap-1">
              <Inbox className="h-4 w-4" />
              초대함
              {/* (선택) <Badge className="ml-1 h-5 px-2">{count}</Badge> */}
            </Button>
          </Link>
        </div>

        {/* 기존 검색 입력란 유지 */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="대화 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex flex-col">
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

        {/* 하단 초대 버튼 */}
        <div className="mt-auto p-4 border-t bg-background">
          <InviteUsersDialog
            chatId={selectedChatId}
            disabled={!selectedChatId}
          />
          <div className="mt-2 mb-2"></div>
          <CreateChatRoomDialog />
          {!selectedChatId && (
            <p className="mt-2 text-xs text-muted-foreground">
              좌측 목록에서 채팅을 하나 선택하시면 초대할 수 있습니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
