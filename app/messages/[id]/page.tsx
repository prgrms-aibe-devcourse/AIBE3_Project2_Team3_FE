import { Header } from "@/components/header"
import { ChatLayout } from "@/components/chat/chat-layout"

// Mock data (same as messages page)
const mockChats = [
  {
    id: "1",
    participant: {
      name: "김클라이언트",
      avatar: "/placeholder.svg",
      isOnline: true,
      lastSeen: "방금 전",
    },
    lastMessage: {
      content: "프로젝트 진행 상황은 어떤가요?",
      timestamp: "2024-01-15T10:30:00Z",
      isRead: false,
      sender: "other" as const,
    },
    unreadCount: 2,
    messages: [
      {
        id: "1",
        content: "안녕하세요! 프로젝트에 대해 문의드리고 싶습니다.",
        timestamp: "2024-01-15T09:00:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
      {
        id: "2",
        content: "네, 안녕하세요! 어떤 프로젝트인지 자세히 알려주시겠어요?",
        timestamp: "2024-01-15T09:05:00Z",
        sender: "me" as const,
        type: "text" as const,
      },
      {
        id: "3",
        content: "React로 전자상거래 사이트를 만들고 싶습니다. 예산은 500만원 정도 생각하고 있어요.",
        timestamp: "2024-01-15T09:10:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
      {
        id: "4",
        content: "좋은 프로젝트네요! 기능 요구사항과 일정에 대해 더 자세히 논의해보면 좋을 것 같습니다.",
        timestamp: "2024-01-15T09:15:00Z",
        sender: "me" as const,
        type: "text" as const,
      },
      {
        id: "5",
        content: "프로젝트 진행 상황은 어떤가요?",
        timestamp: "2024-01-15T10:30:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
    ],
  },
  {
    id: "2",
    participant: {
      name: "이프리랜서",
      avatar: "/placeholder.svg",
      isOnline: false,
      lastSeen: "1시간 전",
    },
    lastMessage: {
      content: "네, 내일 미팅 가능합니다!",
      timestamp: "2024-01-15T08:45:00Z",
      isRead: true,
      sender: "other" as const,
    },
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "안녕하세요! 협업 제안이 있어서 연락드립니다.",
        timestamp: "2024-01-15T08:00:00Z",
        sender: "me" as const,
        type: "text" as const,
      },
      {
        id: "2",
        content: "안녕하세요! 어떤 협업인지 궁금합니다.",
        timestamp: "2024-01-15T08:30:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
      {
        id: "3",
        content: "내일 오후에 화상 미팅 가능하신가요?",
        timestamp: "2024-01-15T08:40:00Z",
        sender: "me" as const,
        type: "text" as const,
      },
      {
        id: "4",
        content: "네, 내일 미팅 가능합니다!",
        timestamp: "2024-01-15T08:45:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
    ],
  },
  {
    id: "3",
    participant: {
      name: "박디자이너",
      avatar: "/placeholder.svg",
      isOnline: true,
      lastSeen: "방금 전",
    },
    lastMessage: {
      content: "디자인 시안 확인 부탁드립니다",
      timestamp: "2024-01-14T16:20:00Z",
      isRead: true,
      sender: "other" as const,
    },
    unreadCount: 0,
    messages: [
      {
        id: "1",
        content: "UI 디자인 작업 완료했습니다!",
        timestamp: "2024-01-14T16:00:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
      {
        id: "2",
        content: "디자인 시안 확인 부탁드립니다",
        timestamp: "2024-01-14T16:20:00Z",
        sender: "other" as const,
        type: "text" as const,
      },
    ],
  },
]

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ChatLayout selectedChatId={params.id} chats={mockChats} />
      </main>
    </div>
  )
}
