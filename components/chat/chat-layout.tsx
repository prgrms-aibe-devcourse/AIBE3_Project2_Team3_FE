"use client"

import { useState } from "react"
import { ChatList } from "./chat-list"
import { ChatWindow } from "./chat-window"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface ChatLayoutProps {
  selectedChatId?: string
  chats: Array<{
    id: string
    participant: {
      name: string
      avatar?: string
      isOnline: boolean
      lastSeen?: string
    }
    lastMessage: {
      content: string
      timestamp: string
      isRead: boolean
      sender: "me" | "other"
    }
    unreadCount: number
    messages: Array<{
      id: string
      content: string
      timestamp: string
      sender: "me" | "other"
      type: "text" | "file" | "image"
      fileUrl?: string
      fileName?: string
    }>
  }>
}

export function ChatLayout({ selectedChatId, chats }: ChatLayoutProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const selectedChat = chats.find((chat) => chat.id === selectedChatId)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={`w-full md:w-1/3 lg:w-1/4 ${selectedChatId ? "hidden md:block" : "block"}`}>
        <ChatList chats={chats} />
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${selectedChatId ? "block" : "hidden md:block"}`}>
        {selectedChat ? (
          <div className="h-full">
            {/* Mobile back button */}
            <div className="md:hidden p-4 border-b">
              <Button variant="ghost" size="sm" onClick={() => setIsMobileView(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                뒤로
              </Button>
            </div>
            <div className="h-full md:h-full">
              <ChatWindow participant={selectedChat.participant} messages={selectedChat.messages} />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">대화를 선택하세요</h3>
              <p className="text-muted-foreground">왼쪽에서 대화를 선택하여 메시지를 확인하세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
