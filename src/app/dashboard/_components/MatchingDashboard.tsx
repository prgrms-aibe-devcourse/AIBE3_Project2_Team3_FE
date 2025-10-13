"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Progress } from "@/global/components/ui/progress";
import { Separator } from "@/global/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/global/components/ui/tabs";
import { useState } from "react";

import {
  Clock,
  DollarSign,
  Files,
  Heart,
  IdCardLanyardIcon,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

import { QuickActions } from "./QuickAction";
import { StatCard } from "./StatsOverview";

export function MatchingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "제안받은 프로젝트",
      value: "24",
      icon: <IdCardLanyardIcon className="h-8 w-8" />,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "지원한 매칭 성공률",
      value: "87%",
      icon: <TrendingUp className="h-8 w-8" />,
      change: "+5%",
      changeType: "increase" as const,
    },
    {
      title: "프리랜서 평균 평점",
      value: "4.8",
      icon: <Star className="h-8 w-8" />,
      change: "+0.2",
      changeType: "increase" as const,
    },
    {
      title: "완료한 프로젝트",
      value: "8",
      icon: <MessageCircle className="h-8 w-8" />,
      change: "+3",
      changeType: "increase" as const,
    },
    {
      title: "모집한 프로젝트",
      value: "24",
      icon: <Files className="h-8 w-8" />,
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "모집한 매칭 수락률",
      value: "87%",
      icon: <TrendingUp className="h-8 w-8" />,
      change: "+5%",
      changeType: "increase" as const,
    },
    {
      title: "프로젝트 평균 평점",
      value: "4.8",
      icon: <Star className="h-8 w-8" />,
      change: "+0.2",
      changeType: "increase" as const,
    },
    {
      title: "마감한 프로젝트",
      value: "8",
      icon: <MessageCircle className="h-8 w-8" />,
      change: "+3",
      changeType: "increase" as const,
    },
  ];

  const recentMatches = [
    {
      id: 1,
      project: "E-commerce 웹사이트 개발",
      client: "김영희",
      budget: "2,000,000원",
      status: "진행중",
      progress: 65,
      avatar: "/placeholder.svg?height=40&width=40",
      deadline: "2024-02-15",
    },
    {
      id: 2,
      project: "모바일 앱 UI/UX 디자인",
      client: "박민수",
      budget: "1,500,000원",
      status: "완료",
      progress: 100,
      avatar: "/placeholder.svg?height=40&width=40",
      deadline: "2024-01-30",
    },
    {
      id: 3,
      project: "데이터 분석 대시보드",
      client: "이지은",
      budget: "3,000,000원",
      status: "검토중",
      progress: 25,
      avatar: "/placeholder.svg?height=40&width=40",
      deadline: "2024-03-01",
    },
  ];

  const recommendedProjects = [
    {
      id: 1,
      title: "React 기반 SaaS 플랫폼 개발",
      description: "스타트업을 위한 고객 관리 시스템 개발",
      budget: "5,000,000원",
      skills: ["React", "Node.js", "PostgreSQL"],
      client: "테크스타트업",
      posted: "2시간 전",
      proposals: 12,
      matchScore: 95,
      urgent: true,
    },
    {
      id: 2,
      title: "모바일 앱 백엔드 API 개발",
      description: "소셜 미디어 앱을 위한 RESTful API 구축",
      budget: "3,500,000원",
      skills: ["Node.js", "MongoDB", "AWS"],
      client: "미디어컴퍼니",
      posted: "5시간 전",
      proposals: 8,
      matchScore: 88,
      urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">대시보드</TabsTrigger>
          <TabsTrigger value="matches">지원한 프로젝트</TabsTrigger>
          <TabsTrigger value="recommendations">제안받은 프로젝트</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickActions />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm">새로운 프로젝트 제안을 받았습니다</p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    10분 전
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">김영희님이 메시지를 보냈습니다</p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    1시간 전
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm">프로젝트 마일스톤이 완료되었습니다</p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    3시간 전
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm">새로운 리뷰가 등록되었습니다</p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    2시간 전
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Earnings */}
            <Card>
              <CardHeader>
                <CardTitle>수익 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      이번 달
                    </span>
                    <span className="font-semibold">4,500,000원</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      지난 달
                    </span>
                    <span className="font-semibold">3,200,000원</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">총 수익</span>
                    <span className="font-bold text-lg text-primary">
                      12,800,000원
                    </span>
                  </div>
                </div>
                <Separator />
                <CardTitle>지출 현황</CardTitle>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      이번 달
                    </span>
                    <span className="font-semibold">4,500,000원</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      지난 달
                    </span>
                    <span className="font-semibold">3,200,000원</span>
                  </div>
                  <Progress value={53} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">총 지출</span>
                    <span className="font-bold text-lg text-primary">
                      12,800,000원
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>진행 중인 프로젝트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={"https://picsum.photos/200"} />
                    <AvatarFallback>이미지</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{match.project}</h4>
                      <Badge
                        variant={
                          match.status === "완료"
                            ? "default"
                            : match.status === "진행중"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {match.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>클라이언트: {match.client}</span>
                      <span>예산: {match.budget}</span>
                      <span>마감: {match.deadline}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>진행률</span>
                        <span>{match.progress}%</span>
                      </div>
                      <Progress value={match.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      채팅
                    </Button>
                    {match.status === "완료" && (
                      <Button variant="outline" size="sm">
                        리뷰 작성
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendedProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {project.matchScore}% 매칭
                        </Badge>
                        {project.urgent && (
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            긴급
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{project.posted}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{project.proposals} 제안</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        관심
                      </Button>
                      <Button
                        size="sm"
                        className={project.urgent ? "animate-pulse" : ""}
                      >
                        지원하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
