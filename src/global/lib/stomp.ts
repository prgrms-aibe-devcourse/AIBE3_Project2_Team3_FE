import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type OnMessage = (body: any) => void;

export function createStompClient(opts: {
  wsUrl?: string;
  reconnectDelay?: number;
  debug?: boolean;
}) {
  const WS_BASE_URL = opts.wsUrl ?? process.env.NEXT_PUBLIC_WS_BASE_URL!;
  const { reconnectDelay = 5000, debug = false } = opts;

  const client = new Client({
    webSocketFactory: () =>
      new SockJS(WS_BASE_URL /*, undefined, { withCredentials: true }*/),
    connectHeaders: {},
    reconnectDelay,
  });

  // 재연결을 위한 구독 저장소
  const subscriptions = new Map<
    string,
    { sub?: StompSubscription; cb: (x: any) => void }
  >();

  client.onConnect = () => {
    // 끊겼다 붙을 때 기존 구독 모두 복구
    for (const [dest, entry] of subscriptions) {
      entry.sub = client.subscribe(dest, (frame: IMessage) => {
        try {
          entry.cb(JSON.parse(frame.body));
        } catch {
          entry.cb(frame.body);
        }
      });
    }
  };

  const connect = () => client.activate();
  const disconnect = () => client.deactivate();

  const subscribe = (destination: string, cb: (msg: any) => void) => {
    // 기존 구독 있으면 해제 후 교체
    const prev = subscriptions.get(destination);
    prev?.sub?.unsubscribe();

    const entry = { cb } as { sub?: StompSubscription; cb: (x: any) => void };

    if (client.connected) {
      entry.sub = client.subscribe(destination, (frame) => {
        try {
          cb(JSON.parse(frame.body));
        } catch {
          cb(frame.body);
        }
      });
    }
    subscriptions.set(destination, entry);

    // 해제 함수 반환
    return () => {
      const cur = subscriptions.get(destination);
      cur?.sub?.unsubscribe();
      subscriptions.delete(destination);
    };
  };

  const send = (destination: string, body: unknown) => {
    client.publish({ destination, body: JSON.stringify(body) });
  };

  return { client, connect, disconnect, subscribe, send };
}
