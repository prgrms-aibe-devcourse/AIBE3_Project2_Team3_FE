"use client";

import { FilterSummaryChips } from "@/global/components/filter/FilterSummaryChips";
import {
  MultiSelect,
  Option,
} from "@/global/components/multi-select/MultiSelect";
import {
  TreeMultiSelect,
  TreeNode,
} from "@/global/components/multi-select/TreeMultiSelect";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { Slider } from "@/global/components/ui/slider";
import { useFreelancerListStore } from "@/global/stores/useFreelancerListStore";
import { useMemo, useState } from "react";

import { Filter, Search, X } from "lucide-react";

type Props = {
  categories: TreeNode[];
  regions: TreeNode[];
  skills: Option[];
  onApply: (filters: {
    search?: string;
    categoryIds: number[];
    regionIds: number[];
    skillIds: number[];
    priceMin?: number;
    priceMax?: number;
  }) => void;
  defaultValues?: Partial<{
    search: string;
    categoryIds: number[];
    regionIds: number[];
    skillIds: number[];
    priceMin: number;
    priceMax: number;
  }>;
};

export function ProjectFilters({
  categories,
  regions,
  skills,
  onApply,
  defaultValues,
}: Props) {
  const MAX_RATE = 10_000_000;
  const RATE_STEP = 10_000;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    search,
    setSearch,
    reset: resetSearch,
  } = useFreelancerListStore((s) => s);

  const [categoryIds, setCategoryIds] = useState<number[]>(
    defaultValues?.categoryIds ?? [],
  );
  const [regionIds, setRegionIds] = useState<number[]>(
    defaultValues?.regionIds ?? [],
  );
  const [skillIds, setSkillIds] = useState<number[]>(
    defaultValues?.skillIds ?? [],
  );
  const [rateRange, setRateRange] = useState<[number, number]>([
    defaultValues?.priceMin ?? 0,
    defaultValues?.priceMax ?? MAX_RATE,
  ]);

  const resetAll = () => {
    setCategoryIds([]);
    setRegionIds([]);
    setSkillIds([]);
    setRateRange([0, MAX_RATE]);
    resetSearch();
  };

  // id -> 이름 매핑(배지 툴팁에 사용)
  const idNameMap = useMemo(() => {
    const map = new Map<number, string>();
    const walk = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        map.set(n.id, n.name);
        if (n.children?.length) walk(n.children);
      }
    };
    walk(categories);
    walk(regions);
    for (const s of skills) map.set(s.id, s.name);
    return (id: number) => map.get(id) ?? `${id}`;
  }, [categories, regions, skills]);

  const apply = () =>
    onApply({
      search,
      categoryIds,
      regionIds,
      skillIds,
      priceMin: rateRange[0],
      priceMax: rateRange[1],
    });

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트 이름, 키워드 검색..."
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">필터</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={resetAll}>
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
            {/* 요약 배지 (타이틀 아래 등 원하는 위치에 배치) */}
            <FilterSummaryChips
              selectedCategories={categoryIds}
              selectedRegions={regionIds}
              selectedSkills={skillIds}
              namesById={idNameMap}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 카테고리 (상/하위 토글 멀티선택) */}
              <div className="space-y-2">
                <Label>카테고리</Label>
                <TreeMultiSelect
                  value={categoryIds}
                  onChange={setCategoryIds}
                  options={categories}
                  placeholder="카테고리 선택"
                  includeChildrenWhenParentChecked
                />
              </div>

              {/* 지역 (상/하위 토글 멀티선택) */}
              <div className="space-y-2">
                <Label>지역</Label>
                <TreeMultiSelect
                  value={regionIds}
                  onChange={setRegionIds}
                  options={regions}
                  placeholder="지역 선택"
                  includeChildrenWhenParentChecked
                />
              </div>

              {/* 스킬 (검색형 멀티선택) */}
              <div className="space-y-2">
                <Label>보유 스킬</Label>
                <MultiSelect
                  value={skillIds}
                  onChange={setSkillIds}
                  options={skills}
                  placeholder="스킬 선택"
                />
              </div>
            </div>

            {/* 비용 */}
            <div className="space-y-4">
              <Label>비용</Label>
              <div className="px-2">
                <Slider
                  value={rateRange}
                  onValueChange={(v) =>
                    setRateRange([v[0], v[1]] as [number, number])
                  }
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

            <Button className="w-full" onClick={apply}>
              필터 적용
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
