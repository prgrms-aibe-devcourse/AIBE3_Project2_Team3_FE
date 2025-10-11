"use client";

import { use } from "react";

import ChatLayout from "../_components/ChatLayout";

export default function ChatPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  return <ChatLayout selectedChatId={Number(id)} />;
}
