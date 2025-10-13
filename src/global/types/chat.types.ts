import { components } from "../backend/apiV1/schema";
import { Pageable } from "./common.types";

export type ChatRoomDto = components["schemas"]["ChatRoomDto"];
export type ChatMessageDto = components["schemas"]["ChatMessageDto"];
export type ChatSendReqBody = components["schemas"]["ChatSendReqBody"];
export type ChatRoomListParam = Pageable;
export type ChatMessageListParam = Pageable;
export type PagePayloadChatMessageDto =
  components["schemas"]["PagePayloadChatMessageDto"];
