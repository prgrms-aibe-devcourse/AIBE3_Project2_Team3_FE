"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, MapPin, DollarSign } from "lucide-react"

export function ProfileForm() {
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript", "Node.js"])
  const [newSkill, setNewSkill] = useState("")
  const [portfolio, setPortfolio] = useState<File[]>([])

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handlePortfolioUpload = (files: File[]) => {
    setPortfolio((prev) => [...prev, ...files])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle>프로필 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback>김철수</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                프로필 사진 변경
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG 파일만 업로드 가능 (최대 5MB)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" defaultValue="김철수" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">직업/전문분야</Label>
              <Input id="title" defaultValue="풀스택 개발자" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">지역</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="location" className="pl-10" defaultValue="서울, 대한민국" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">경력</Label>
              <Select defaultValue="3-5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1년</SelectItem>
                  <SelectItem value="1-3">1-3년</SelectItem>
                  <SelectItem value="3-5">3-5년</SelectItem>
                  <SelectItem value="5-10">5-10년</SelectItem>
                  <SelectItem value="10+">10년 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue="안녕하세요! 5년 경력의 풀스택 개발자입니다. React, Node.js를 주로 사용하며, 사용자 경험을 중시하는 웹 애플리케이션 개발을 전문으로 합니다."
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>기술 스택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="새 기술 추가"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rates */}
      <Card>
        <CardHeader>
          <CardTitle>요금 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourly-rate">시간당 요금</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="hourly-rate" className="pl-10" defaultValue="50,000" />
                <span className="absolute right-3 top-3 text-sm text-muted-foreground">원/시간</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-rate">프로젝트 최소 요금</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="project-rate" className="pl-10" defaultValue="500,000" />
                <span className="absolute right-3 top-3 text-sm text-muted-foreground">원</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>포트폴리오</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handlePortfolioUpload}
            accept="image/*,.pdf,.doc,.docx"
            multiple={true}
            maxSize={10}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">프로필 저장</Button>
      </div>
    </div>
  )
}
