"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: "me" | "other"
  type: "text" | "file" | "image"
  fileUrl?: string
  fileName?: string
}

interface ChatWindowProps {
  participant: {
    name: string
    avatar?: string
    isOnline: boolean
    lastSeen?: string
  }
  messages: Message[]
}

export function ChatWindow({ participant, messages }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      // TODO: Implement send message logic
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={participant.avatar || "/placeholder.svg"} />
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
            </Avatar>
            {participant.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{participant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {participant.isOnline ? "온라인" : `마지막 접속: ${participant.lastSeen}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>프로필 보기</DropdownMenuItem>
              <DropdownMenuItem>대화 검색</DropdownMenuItem>
              <DropdownMenuItem>알림 설정</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">대화 차단</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] ${message.sender === "me" ? "order-2" : "order-1"}`}>
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {message.type === "text" && <p className="text-sm">{message.content}</p>}
                {message.type === "file" && (
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{message.fileName}</span>
                  </div>
                )}
                {message.type === "image" && (
                  <div className="space-y-2">
                    <img
                      src={message.fileUrl || "/placeholder.svg"}
                      alt="Shared image"
                      className="rounded max-w-full h-auto"
                    />
                    {message.content && <p className="text-sm">{message.content}</p>}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 px-1">{formatTime(message.timestamp)}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
