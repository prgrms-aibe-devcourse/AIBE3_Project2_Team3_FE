"use client";

import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
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
import { useProjectListStore } from "@/global/stores/useProjectListStore";
import { useState } from "react";

import { Filter, Search, X } from "lucide-react";

export function ProjectFilters() {
  const { page, size, sort, search, setSearch, reset } = useProjectListStore(
    (state) => state,
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([0, 10000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트, 스킬, 키워드 검색..."
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

      {/* Filters Panel */}
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
              {/* Category */}
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

              {/* Location */}
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

              {/* Duration */}
              <div className="space-y-2">
                <Label>프로젝트 기간</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="기간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1주 이내</SelectItem>
                    <SelectItem value="1month">1개월 이내</SelectItem>
                    <SelectItem value="3months">3개월 이내</SelectItem>
                    <SelectItem value="6months">6개월 이내</SelectItem>
                    <SelectItem value="long">장기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-4">
              <Label>예산 범위</Label>
              <div className="px-2">
                <Slider
                  value={budgetRange}
                  onValueChange={setBudgetRange}
                  max={10000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{budgetRange[0].toLocaleString()}원</span>
                  <span>{budgetRange[1].toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label>필요 스킬</Label>
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

            <Button className="w-full">필터 적용</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
