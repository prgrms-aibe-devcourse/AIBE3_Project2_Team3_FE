"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"

interface ChatListProps {
  chats: Array<{
    id: string
    participant: {
      name: string
      avatar?: string
      isOnline: boolean
    }
    lastMessage: {
      content: string
      timestamp: string
      isRead: boolean
      sender: "me" | "other"
    }
    unreadCount: number
  }>
}

export function ChatList({ chats }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredChats = chats.filter((chat) => chat.participant.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          메시지
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="대화 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <Link key={chat.id} href={`/messages/${chat.id}`}>
              <div className="flex items-center space-x-3 p-4 hover:bg-accent transition-colors cursor-pointer">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{chat.participant.name[0]}</AvatarFallback>
                  </Avatar>
                  {chat.participant.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.participant.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">{chat.lastMessage.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      chat.lastMessage.isRead ? "text-muted-foreground" : "text-foreground font-medium"
                    }`}
                  >
                    {chat.lastMessage.sender === "me" ? "나: " : ""}
                    {chat.lastMessage.content}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {filteredChats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "검색 결과가 없습니다" : "아직 대화가 없습니다"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
