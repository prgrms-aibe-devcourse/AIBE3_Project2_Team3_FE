"use client";

import { ProfileForm } from "@/components/profile/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);

  // 임시 프로필 정보 (실제 데이터 연동 시 수정)
  const profile = {
    name: "김철수",
    title: "풀스택 개발자",
    location: "서울, 대한민국",
    experience: "3-5년",
    bio: "안녕하세요! 5년 경력의 풀스택 개발자입니다. React, Node.js를 주로 사용하며, 사용자 경험을 중시하는 웹 애플리케이션 개발을 전문으로 합니다.",
    avatar: "/placeholder.svg?height=96&width=96",
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">프로필 관리</h1>
        <p className="text-muted-foreground">
          프로필 정보를 업데이트하여 더 많은 프로젝트 기회를 얻으세요
        </p>
      </div>
      {editMode ? (
        <ProfileForm onSave={() => setEditMode(false)} />
      ) : (
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{profile.name}</CardTitle>
              <div className="text-muted-foreground text-sm">
                {profile.title}
              </div>
              <div className="text-muted-foreground text-sm">
                {profile.location}
              </div>
              <div className="text-muted-foreground text-sm">
                경력: {profile.experience}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="font-semibold mb-1">자기소개</div>
              <div className="text-muted-foreground whitespace-pre-line">
                {profile.bio}
              </div>
            </div>
            <Button onClick={() => setEditMode(true)} size="lg">
              수정
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
