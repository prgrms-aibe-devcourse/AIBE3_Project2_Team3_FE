import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type Parser<T> = (raw: string) => T;

function defaultJsonParser<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

export function createStompClient(opts: {
  wsUrl?: string;
  reconnectDelay?: number;
}) {
  const WS_BASE_URL = opts.wsUrl ?? process.env.NEXT_PUBLIC_WS_BASE_URL!;
  const { reconnectDelay = 5000 } = opts;

  const client = new Client({
    webSocketFactory: () => new SockJS(WS_BASE_URL),
    connectHeaders: {},
    reconnectDelay,
  });

  /**
   * 구독 저장소
   * - notify: 프레임 수신 시 실행되는 안전한 디스패처
   */
  const subscriptions = new Map<
    string,
    { sub?: StompSubscription; notify: (frame: IMessage) => void }
  >();

  client.onConnect = () => {
    // 재연결 시 기존 구독 복구
    for (const [dest, entry] of subscriptions) {
      entry.sub = client.subscribe(dest, entry.notify);
    }
  };

  const connect = () => client.activate();
  const disconnect = () => client.deactivate();

  /**
   * 타입 안전한 구독
   * @param destination STOMP destination
   * @param cb 수신 콜백 (파싱된 T)
   * @param parser 문자열 -> T (기본: JSON.parse)
   * @returns unsubscribe 함수
   */
  function subscribe<T>(
    destination: string,
    cb: (msg: T) => void,
    parser: Parser<T> = defaultJsonParser<T>,
  ): () => void {
    // 이전 구독이 있으면 해제
    const prev = subscriptions.get(destination);
    prev?.sub?.unsubscribe();

    // 프레임 -> T 파싱 후 콜백 호출
    const notify = (frame: IMessage) => {
      try {
        const parsed = parser(frame.body);
        cb(parsed);
      } catch {
        // 파싱 실패 시 raw를 던지고 싶다면 아래처럼 커스텀 처리 가능
        // (여기서는 콘솔만)
        console.warn("[STOMP] parse error for", destination, frame.body);
      }
    };

    const entry: { sub?: StompSubscription; notify: (f: IMessage) => void } = {
      notify,
    };

    if (client.connected) {
      entry.sub = client.subscribe(destination, notify);
    }
    subscriptions.set(destination, entry);

    // 해제 함수
    return () => {
      const cur = subscriptions.get(destination);
      cur?.sub?.unsubscribe();
      subscriptions.delete(destination);
    };
  }

  /**
   * 타입 안전한 발행
   * @param destination STOMP destination
   * @param body 직렬화될 페이로드
   * @param stringify 커스텀 직렬화 (기본: JSON.stringify)
   */
  function send<T>(
    destination: string,
    body: T,
    stringify: (v: T) => string = (v) => JSON.stringify(v),
  ): void {
    client.publish({ destination, body: stringify(body) });
  }

  return { client, connect, disconnect, subscribe, send };
}
