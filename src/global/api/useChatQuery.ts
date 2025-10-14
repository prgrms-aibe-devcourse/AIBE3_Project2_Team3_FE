import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
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
  CreateRoomReqBody,
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
  const res = unwrap(
    await client.GET("/api/v1/users/search", {
      params: { query: { username: q.trim() } },
    }),
  );
  const item = (res as any)?.data ?? null;
  if (!item) return [];
  return [{ id: item.userId, username: item.userName }]; // ← 단일을 배열로
};

const inviteInbox = async () =>
  unwrap(await client.GET("/api/v1/chat/invites"));

const acceptRoomInvite = async (roomId: number) =>
  unwrap(
    await client.POST("/api/v1/chat/rooms/{roomId}/invites/accept", {
      params: { path: { roomId } },
    }),
  );

const refuseRoomInvite = async (roomId: number) =>
  unwrap(
    await client.POST("/api/v1/chat/rooms/{roomId}/invites/refuse", {
      params: { path: { roomId } },
    }),
  );

const createRoom = async (body: CreateRoomReqBody) =>
  unwrap(await client.POST("/api/v1/chat/rooms", { body }));

export const chatQueryKeys = createQueryKeys("chat", {
  chatRoomLists: () => ["room", "list"],
  chatRoomList: (param) => ["room", "list", param],
  chatMessageLists: () => ["message", "list"],
  chatMessageList: (roomId) => ["message", "list", roomId],
  send: (roomId) => ["message", "send", roomId],
  rooms: () => ["rooms"],
  searchInvitees: (q: string) => ["searchInvitees", q],
  invite: (roomId: number) => ["invite", roomId],
  invites: (userId: number | undefined) => ["invites", userId],
  acceptInvite: (roomId: number) => ["invite", "accept", roomId],
  refuseInvite: (roomId: number) => ["invite", "refuse", roomId],
  create: () => ["rooms", "create"],
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

export const useInviteInbox = (userId: number | undefined) =>
  useQuery({
    queryKey: chatQueryKeys.invites(userId).queryKey,
    queryFn: inviteInbox,
    enabled: !!userId,
    // 필요시 staleTime 등 옵션 추가 가능 (기능 동일 원하면 생략해도 됨)
  });

// 초대 수락
export const useAcceptInvite = () =>
  useMutation({
    mutationKey: chatQueryKeys.acceptInvite(0).queryKey, // roomId는 실행 시 인자로
    mutationFn: (roomId: number) => acceptRoomInvite(roomId),
  });

// 초대 거절
export const useRefuseInvite = () =>
  useMutation({
    mutationKey: chatQueryKeys.refuseInvite(0).queryKey,
    mutationFn: (roomId: number) => refuseRoomInvite(roomId),
  });

// 채팅방 생성
export const useCreateChatRoom = () =>
  useMutation({
    mutationKey: chatQueryKeys.create().queryKey,
    mutationFn: (body: CreateRoomReqBody) => createRoom(body),
  });
