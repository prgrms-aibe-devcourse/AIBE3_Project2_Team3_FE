"use client";

import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Checkbox } from "@/global/components/ui/checkbox";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/global/components/ui/select";
import { Slider } from "@/global/components/ui/slider";
import { useFreelancerListStore } from "@/global/stores/useFreelancerListStore";
import { useState } from "react";

import { Filter, Search, X } from "lucide-react";

export function FreelancerFilters() {
  const MAX_RATE = 10_000_000;
  const RATE_STEP = 10_000;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rateRange, setRateRange] = useState([0, MAX_RATE]);
  const { search, setSearch, reset } = useFreelancerListStore((state) => state);

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프리랜서 이름, 스킬, 키워드 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          필터
        </Button>
      </div>

      {/* 필터 패널 */}
      {isFilterOpen && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">필터</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={reset}>
                초기화
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 카테고리 */}
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">개발</SelectItem>
                    <SelectItem value="design">디자인</SelectItem>
                    <SelectItem value="marketing">마케팅</SelectItem>
                    <SelectItem value="writing">글쓰기</SelectItem>
                    <SelectItem value="translation">번역</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 지역 */}
              <div className="space-y-2">
                <Label>지역</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))} */}
                  </SelectContent>
                </Select>
              </div>

              {/* 경력 (스킬 레벨) */}
              <div className="space-y-2">
                <Label>경력 수준</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="경력 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">신입 (0-1년)</SelectItem>
                    <SelectItem value="junior">주니어 (1-3년)</SelectItem>
                    <SelectItem value="mid">미드 (3-5년)</SelectItem>
                    <SelectItem value="senior">시니어 (5년+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 비용 */}
            <div className="space-y-4">
              <Label>비용</Label>
              <div className="px-2">
                <Slider
                  value={rateRange}
                  onValueChange={setRateRange}
                  max={MAX_RATE}
                  step={RATE_STEP}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{rateRange[0].toLocaleString()}원</span>
                  <span>{rateRange[1].toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 기술 */}
            <div className="space-y-3">
              <Label>보유 스킬</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={selectedSkills.includes(skill)}
                      onCheckedChange={() => handleSkillToggle(skill)}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))} */}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-3">
              <Label>가용성</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="available" />
                  <Label htmlFor="available" className="text-sm">
                    현재 프로젝트 가능
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="online" />
                  <Label htmlFor="online" className="text-sm">
                    온라인 상태
                  </Label>
                </div>
              </div>
            </div>

            <Button className="w-full">필터 적용</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
