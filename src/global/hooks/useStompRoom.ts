import { createStompClient } from "@/global/lib/stomp";
import { useEffect, useMemo, useRef } from "react";

export function useStompRoom(roomId: number, onMessage: (dto: any) => void) {
  // 최신 onMessage 보존(구독을 매 렌더마다 갈아끼우지 않기 위함)
  const cbRef = useRef(onMessage);
  useEffect(() => {
    cbRef.current = onMessage;
  }, [onMessage]);

  // 클라이언트 생성(토큰/WS_URL이 바뀔 때만 재생성)
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

    // 연결 (이미 연결되어 있으면 내부적으로 무시)
    api.connect();

    // 방 구독
    const unsubscribe = api.subscribe(`/sub/rooms/${roomId}`, (msg) => {
      cbRef.current(msg);
    });

    // 정리
    return () => {
      unsubscribe();
      // 전역 싱글톤이 아니라면 여기서 끊어도 됨
      // api.disconnect();
    };
  }, [api, roomId]);

  const send = (content: string) => {
    if (!content.trim()) return;
    api.send(`/pub/rooms/${roomId}/send`, { content });
  };

  return { send, client: api.client };
}
