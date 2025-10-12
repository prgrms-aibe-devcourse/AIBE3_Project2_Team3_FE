import { createStompClient } from "@/global/lib/stomp";
import { useEffect, useMemo, useRef } from "react";

import { ChatMessageDto } from "../types/chat.types";

type SendPayload = { content: string };

export function useStompRoom(
  roomId: number,
  onMessage: (dto: ChatMessageDto) => void,
) {
  // 최신 onMessage 보존
  const cbRef = useRef<(dto: ChatMessageDto) => void>(onMessage);
  useEffect(() => {
    cbRef.current = onMessage;
  }, [onMessage]);

  // 클라이언트 생성
  const api = useMemo(
    () =>
      createStompClient({
        wsUrl: process.env.NEXT_PUBLIC_WS_BASE_URL!,
        reconnectDelay: 5000,
      }),
    [],
  );

  useEffect(() => {
    if (!roomId) return;

    api.connect();

    // ✅ 제네릭 타입 지정: ChatMessageDto
    const unsubscribe = api.subscribe<ChatMessageDto>(
      `/sub/rooms/${roomId}`,
      (msg) => {
        cbRef.current(msg); // msg는 ChatMessageDto로 추론됨
      },
      // 선택) 런타임 검증이 필요하면 파서 전달:
      // (raw) => ChatMessageDtoSchema.parse(JSON.parse(raw))
    );

    return () => {
      unsubscribe();
      // api.disconnect(); // 싱글톤이 아니라면 필요 시
    };
  }, [api, roomId]);

  const send = (content: string) => {
    if (!content.trim()) return;
    // (선택) 보낼 페이로드 타입 명시
    api.send<SendPayload>(`/pub/rooms/${roomId}/send`, { content });
  };

  return { send, client: api.client };
}
