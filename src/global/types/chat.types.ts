import { components } from "../backend/apiV1/schema";
import { Pageable } from "./common.types";

export type ChatRoomDto = components["schemas"]["ChatRoomDto"];
export type ChatMessageDto = components["schemas"]["ChatMessageDto"];
export type ChatSendReqBody = components["schemas"]["ChatSendReqBody"];
export type ChatRoomListParam = Pageable;
export type ChatMessageListParam = Pageable;
export type PagePayloadChatMessageDto =
  components["schemas"]["PagePayloadChatMessageDto"];
export type ChatInviteReqBody = components["schemas"]["ChatInviteReqBody"];
export type RsDataChatInviteResBody =
  components["schemas"]["RsDataChatInviteResBody"];
export type UserInviteDto = components["schemas"]["UserInviteDto"];
export type ChatCreateReqBody = components["schemas"]["ChatCreateReqBody"];
export type PagePayloadChatRoomDto =
  components["schemas"]["PagePayloadChatRoomDto"];
