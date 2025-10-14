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

const invite = async (roomId: number, body: ChatInviteReqBody) =>
  unwrap<RsDataChatInviteResBody>(
    await client.POST("/api/v1/chat/rooms/{roomId}/invites", {
      params: { path: { roomId } },
      body,
    }),
  );

const searchInvitees = async (q: string): Promise<InviteUserSummary[]> => {
  if (!q.trim()) return [];
  const res = await unwrap(
    await client.POST("/api/v1/users/searchToInvite", {
      body: { username: q.trim() },
    }),
  );

  const list = (res as any)?.data ?? (res as any) ?? [];
  return (list as Array<{ userId: number; userName: string }>).map((u) => ({
    id: u.userId,
    username: u.userName,
  }));
};

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
    getNextPageParam: (res) => (res.page.last ? null : res.page.page + 1),
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
    getNextPageParam: (res) => (res.page.last ? null : res.page.page + 1),
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
        chatQueryKeys.chatMessageList(roomId).queryKey,
        (old) => {
          if (!old) return old;
          const pages = [...old.pages];
          const last = pages.length - 1;
          pages[last] = {
            ...pages[last],
            content: [...pages[last].content, newMsg],
          };
          return { ...old, pages };
        },
      );
      // 필요 시 방 목록 invalidate
      // qc.invalidateQueries({ queryKey: chatQueryKeys.chatRoomLists().queryKey });
    },
  });
};

export function useInviteUsers(roomId: number | undefined) {
  return useMutation({
    mutationKey: chatQueryKeys.invite(roomId ?? 0).queryKey,
    mutationFn: (inviteeIds: number[]) => {
      if (!roomId) throw new Error("roomId가 없습니다.");
      const body: ChatInviteReqBody = { inviteeIds };
      return invite(roomId, body);
    },
  });
}

export async function searchUsersToInvite(q: string) {
  return searchInvitees(q);
}
