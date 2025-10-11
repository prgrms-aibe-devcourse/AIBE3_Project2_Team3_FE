"use client";

import { Button } from "@/global/components/ui/button";
import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";

interface ChatLayoutProps {
  selectedChatId?: number;
}

export default function ChatLayout({ selectedChatId }: ChatLayoutProps) {
  const [isMobileView, setIsMobileView] = useState(false);

  return (
    <div className="py-4 px-4">
      <main>
        <div className="h-[calc(100vh-4rem)] flex space-x-4">
          {/* Chat List - Hidden on mobile when chat is selected */}
          <div
            className={`w-full md:w-1/3 lg:w-1/4 ${selectedChatId ? "hidden md:block" : "block"}`}
          >
            <ChatList selectedChatId={selectedChatId} />
          </div>

          {/* Chat Window */}
          <div
            className={`flex-1 ${selectedChatId ? "block" : "hidden md:block"}`}
          >
            {selectedChatId ? (
              <div className="h-full">
                {/* Mobile back button */}
                <div className="md:hidden p-4 border-b">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileView(false)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    뒤로
                  </Button>
                </div>
                <div className="h-full md:h-full">
                  <ChatWindow selectedChatId={selectedChatId} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium mb-2">
                    대화를 선택하세요
                  </h3>
                  <p className="text-muted-foreground">
                    왼쪽에서 대화를 선택하여 메시지를 확인하세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
