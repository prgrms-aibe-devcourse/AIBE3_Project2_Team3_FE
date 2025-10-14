import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useChatMessageListStore } from "../stores/useChatMessageListStore";
import { useChatRoomListStore } from "../stores/useChatRoomListStore";
import {
  ChatInviteReqBody,
  ChatMessageDto,
  ChatMessageListParam,
  ChatRoomListParam,
  ChatSendReqBody,
  InviteUserSummary,
  PagePayloadChatMessageDto,
  RsDataChatInviteResBody,
} from "../types/chat.types";

const chatRoomList = async (param: ChatRoomListParam) =>
  unwrap(
    await client.GET("/api/v1/chat/rooms", {
      params: { query: param },
    }),
  );
const chatMessageList = async (roomId: number, param: ChatMessageListParam) =>
  unwrap(
    await client.GET("/api/v1/chat/rooms/{roomId}/messages", {
      params: { path: { roomId }, query: param },
    }),
  );

const send = async (roomId: number, body: ChatSendReqBody) =>
  unwrap(
    await client.POST("/api/v1/chat/rooms/{roomId}/messages", {
      params: { path: { roomId } },
      body,
    }),
  );

export const chatQueryKeys = createQueryKeys("chat", {
  chatRoomLists: () => ["room", "list"],
  chatRoomList: (param) => ["room", "list", param],
  chatMessageLists: () => ["message", "list"],
  chatMessageList: (roomId) => ["message", "list", roomId],
  send: (roomId) => ["message", "send", roomId],
  rooms: () => ["rooms"],
  searchInvitees: (q: string) => ["searchInvitees", q],
  invite: (roomId: number) => ["invite", roomId],
});

export const useListChatRoom = () => {
  const { size, sort } = useChatRoomListStore((state) => state);
  const param = useMemo(() => ({ size, sort }), [size, sort]);
  return useInfiniteQuery({
    queryKey: chatQueryKeys.chatRoomList(param).queryKey,
    queryFn: ({ pageParam }) => chatRoomList({ ...param, page: pageParam }),
    getNextPageParam: (res) => {
      return res.page.last ? null : res.page.page + 1;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useListChatMessage = (roomId: number) => {
  const { size, sort } = useChatMessageListStore((state) => state);
  const param = useMemo(() => ({ size, sort }), [size, sort]);
  return useInfiniteQuery({
    queryKey: chatQueryKeys.chatMessageList(roomId).queryKey,
    queryFn: ({ pageParam }) =>
      chatMessageList(roomId, { ...param, page: pageParam }),
    getNextPageParam: (res) => {
      return res.page.last ? null : res.page.page + 1;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useSendChatMessage = (roomId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: chatQueryKeys.send(roomId).queryKey,
    mutationFn: (body: ChatSendReqBody) => send(roomId, body),
    onSuccess: (res) => {
      const newMsg: ChatMessageDto = res.data;

      qc.setQueryData<InfiniteData<PagePayloadChatMessageDto>>(
        chatQueryKeys.chatMessageList(roomId).queryKey, // ← 너의 메시지 목록 키
        (old) => {
          if (!old) return old; // 목록을 아직 안 불렀다면 스킵(원하면 초기 페이지 만들어 붙여도 됨)
          const pages = [...old.pages];
          const last = pages.length - 1;
          pages[last] = {
            ...pages[last],
            content: [...pages[last].content, newMsg], // 마지막 페이지 끝에 추가
          };
          return { ...old, pages };
        },
      );

      // 방 목록(미읽음/프리뷰/정렬 등)도 즉시 반영하고 싶으면 invalidate
      //   qc.invalidateQueries({ queryKey: chatQueryKeys.chatRoomListBase.queryKey });
    },
  });
};

/** 초대 훅 (POST /invites) */
export function useInviteUsers(roomId: number | undefined) {
  return useMutation({
    mutationKey: chatQueryKeys.invite(roomId ?? 0).queryKey,
    mutationFn: async (inviteeIds: number[]) => {
      if (!roomId) throw new Error("roomId가 없습니다.");
      const body: ChatInviteReqBody = { inviteeIds };
      const res = await client.POST("/api/v1/chat/rooms/{roomId}/invites", {
        params: { path: { roomId } },
        body,
      });
      const data = unwrap<RsDataChatInviteResBody>(res);
      return data;
    },
  });
}

export async function searchUsersToInvite(q: string) {
  if (!q.trim()) return [] as InviteUserSummary[];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/searchToInvite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ username: q.trim() }),
      credentials: "include",
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "유저 검색 실패");
  }
  const body = await res.json();
  const list = (body?.data ?? []) as Array<{
    userId: number;
    userName: string;
  }>;
  return list.map((u) => ({
    id: u.userId,
    username: u.userName,
  })) as InviteUserSummary[];
}
