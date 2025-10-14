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
import { SALARY_MAX_RANGE } from "@/global/consts";
import { clamp, computeStep, roundTo } from "@/global/lib/utils";
import { useFreelancerListStore } from "@/global/stores/useFreelancerListStore";
import { applyParams } from "@/global/types/common.types";
import { useEffect, useMemo, useRef, useState } from "react";

import { Filter, Search, X } from "lucide-react";

type Props = {
  categories: TreeNode[];
  regions: TreeNode[];
  skills: Option[];
  onApply: (filter: applyParams) => void;
  defaultValues?: Partial<applyParams>;
};

export function FreelancerFilters({
  categories,
  regions,
  skills,
  onApply,
  defaultValues,
}: Props) {
  const MAX_RATE = SALARY_MAX_RANGE;
  const RATE_STEP = 10_000;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const {
    keyword,
    setKeyword,
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
  const [minBound, setMinBound] = useState(0);
  const [maxBound, setMaxBound] = useState(SALARY_MAX_RANGE);
  const [minInput, setMinInput] = useState(String(minBound));
  const [maxInput, setMaxInput] = useState(String(maxBound));

  const [rateRange, setRateRange] = useState<[number, number]>([
    minBound,
    maxBound,
  ]);

  const step = useMemo(
    () => computeStep(minBound, maxBound),
    [minBound, maxBound],
  );

  // ✅ "사용자 입력으로 bounds를 바꿨다"는 신호
  const forceFullSpanRef = useRef(false);

  const applyMinImmediate = (raw: string) => {
    setMinInput(raw);
    const n = Number(raw.replaceAll(",", ""));
    if (Number.isFinite(n)) {
      const newMin = Math.min(n, maxBound);
      forceFullSpanRef.current = true; // ✅ 다음 effect에서 [min,max]로 꽉 채우기
      setMinBound(newMin);
    }
  };

  const applyMaxImmediate = (raw: string) => {
    setMaxInput(raw);
    const n = Number(raw.replaceAll(",", ""));
    if (Number.isFinite(n)) {
      const newMax = Math.max(n, minBound);
      forceFullSpanRef.current = true; // ✅ 다음 effect에서 [min,max]로 꽉 채우기
      setMaxBound(newMax);
    }
  };

  const onMinBlur = () => {
    const n = roundTo(
      clamp(Number(minInput.replaceAll(",", "")) || 0, 0, maxBound),
      step,
    );
    forceFullSpanRef.current = true; // 포맷팅으로 값 달라져도 풀스팬
    setMinBound(n);
    setMinInput(n.toLocaleString());
  };
  const onMaxBlur = () => {
    const n = roundTo(
      clamp(Number(maxInput.replaceAll(",", "")) || 0, minBound, Infinity),
      step,
    );
    forceFullSpanRef.current = true;
    setMaxBound(n);
    setMaxInput(n.toLocaleString());
  };

  // ✅ bounds/step이 바뀔 때의 동작
  useEffect(() => {
    if (forceFullSpanRef.current) {
      // 사용자 입력으로 bounds 변경됨 → 슬라이더를 즉시 [min,max]로 리셋
      const lo = roundTo(minBound, step);
      const hi = roundTo(maxBound, step);
      setRateRange([lo, Math.max(lo, hi)] as [number, number]);
      forceFullSpanRef.current = false;
      return;
    }

    // 그 외(외부 영향 등) → 기존 값만 범위/스텝에 맞춰 보정
    const lo = roundTo(clamp(rateRange[0], minBound, maxBound), step);
    const hi = roundTo(clamp(rateRange[1], minBound, maxBound), step);
    setRateRange([Math.min(lo, hi), Math.max(lo, hi)] as [number, number]);
  }, [minBound, maxBound, step]); // bounds 또는 step이 바뀔 때마다

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
      categoryIds,
      regionIds,
      skillIds,
      minSalary: rateRange[0],
      maxSalary: rateRange[1],
    });

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프리랜서 이름, 키워드 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>최소 금액</Label>
                  <Input
                    value={minInput}
                    onChange={(e) => applyMinImmediate(e.target.value)}
                    onBlur={onMinBlur}
                    inputMode="numeric"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>최대 금액</Label>
                  <Input
                    value={maxInput}
                    onChange={(e) => applyMaxImmediate(e.target.value)}
                    onBlur={onMaxBlur}
                    inputMode="numeric"
                    placeholder={SALARY_MAX_RANGE.toLocaleString()}
                  />
                </div>
              </div>

              {/* 슬라이더: bounds/step 변하면 즉시 remount되게 key 지정 */}
              <div className="space-y-4">
                <Label>비용</Label>
                <div className="px-2">
                  <Slider
                    key={`b-${minBound}-${maxBound}-s-${step}`}
                    min={minBound}
                    max={maxBound}
                    step={step}
                    value={rateRange}
                    onValueChange={(v) => {
                      const lo = roundTo(clamp(v[0], minBound, maxBound), step);
                      const hi = roundTo(clamp(v[1], minBound, maxBound), step);
                      setRateRange([Math.min(lo, hi), Math.max(lo, hi)] as [
                        number,
                        number,
                      ]);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{rateRange[0].toLocaleString()}원</span>
                    <span>{rateRange[1].toLocaleString()}원</span>
                  </div>
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
