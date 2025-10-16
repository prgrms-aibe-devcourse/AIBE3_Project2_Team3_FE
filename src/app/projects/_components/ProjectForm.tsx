"use client";

import { useListCategory } from "@/global/api/useCategoryQuery";
import { useListRegion } from "@/global/api/useRegionQuery";
import { NumberInput } from "@/global/components/custom-input/NumberInput";
import { UnitInput } from "@/global/components/custom-input/UnitInput";
import { AsyncInfiniteMultiSelect } from "@/global/components/multi-select/InfiniteMultiSelect";
import { MultiChildSelect } from "@/global/components/multi-select/MultiChildSelect";
import { CustomDatepicker } from "@/global/components/ui/CustomDatepicker";
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
import { RadioGroup, RadioGroupItem } from "@/global/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/global/components/ui/select";
import { Textarea } from "@/global/components/ui/textarea";
import { EXPERIENCE_OPTIONS, SALARY_UNITS } from "@/global/consts";
import {
  fromExperience,
  fromUnit,
  toLocalDateTimeString,
  toUnit,
} from "@/global/lib/utils";
import {
  EmploymentType,
  HirerType,
  ProjectDto,
  ProjectWriteReqBody,
} from "@/global/types/project.types";
import { addDays, startOfDay } from "date-fns";
import { useEffect, useState } from "react";

type ProjectFormProps = {
  onSubmit: (param: ProjectWriteReqBody) => void;
  onCancel: () => void;
  defaultValues?: ProjectDto;
};

export function ProjectForm({
  onSubmit,
  onCancel,
  defaultValues,
}: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [selectedRegion, setSelectedRegion] = useState<number[]>(
    defaultValues?.regions
      ? defaultValues.regions.map((region) => region.id)
      : [],
  );
  const [selectedCategory, setSelectedCategory] = useState<number[]>(
    defaultValues?.categories
      ? defaultValues.categories.map((category) => category.id)
      : [],
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>(
    defaultValues?.skills ? defaultValues.skills.map((skill) => skill.id) : [],
  );
  const [salary, setSalary] = useState(
    defaultValues?.salary
      ? {
          amount: fromUnit(SALARY_UNITS, defaultValues.salary, "krw"),
          unit: "krw",
        }
      : { amount: 1, unit: "krw_10k" },
  );
  const [hirerType, setHirerType] = useState<HirerType>(
    (defaultValues?.hirerType as HirerType) ?? "individual",
  );
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    (defaultValues?.employmentType as EmploymentType) ?? "onsite",
  );
  const [personnel, setPersonel] = useState({
    amount: defaultValues?.personnel ?? 0,
    unit: "person",
  });
  const [skillLevel, setSkillLevel] = useState(
    defaultValues?.skillLevel
      ? fromExperience(defaultValues.skillLevel)
      : EXPERIENCE_OPTIONS[0].id,
  );
  const [deadlineDate, setDeadlineDate] = useState<Date>(
    defaultValues?.deadlineDate
      ? new Date(defaultValues.deadlineDate)
      : startOfDay(addDays(new Date(), 7)),
  );
  const [startedDate, setStartedDate] = useState<Date>(
    defaultValues?.startedDate
      ? new Date(defaultValues.startedDate)
      : startOfDay(addDays(new Date(), 14)),
  );
  const [endedDate, setEndedDate] = useState<Date>(
    defaultValues?.endedDate
      ? new Date(defaultValues.endedDate)
      : startOfDay(addDays(new Date(), 21)),
  );

  useEffect(() => {
    if (!defaultValues) return;
    setTitle(defaultValues.title ?? "");
    setContent(defaultValues.content ?? "");
    setSelectedRegion(
      defaultValues.regions
        ? defaultValues.regions.map((region) => region.id)
        : [],
    );
    setSelectedCategory(
      defaultValues.categories
        ? defaultValues.categories.map((category) => category.id)
        : [],
    );
    setSelectedSkillIds(
      defaultValues.skills ? defaultValues.skills.map((skill) => skill.id) : [],
    );
    setSalary(
      defaultValues.salary
        ? {
            amount: fromUnit(SALARY_UNITS, defaultValues.salary, "krw"),
            unit: "krw",
          }
        : { amount: 1, unit: "krw_10k" },
    );
    setPersonel({
      amount: defaultValues.personnel ?? 0,
      unit: "person",
    });
    setHirerType((defaultValues.hirerType as HirerType) ?? "individual");
    setEmploymentType(
      (defaultValues.employmentType as EmploymentType) ?? "onsite",
    );
    setSkillLevel(
      defaultValues.skillLevel
        ? fromExperience(defaultValues.skillLevel)
        : EXPERIENCE_OPTIONS[0].id,
    );
    setDeadlineDate(
      defaultValues.deadlineDate
        ? new Date(defaultValues.deadlineDate)
        : startOfDay(addDays(new Date(), 7)),
    );
    setStartedDate(
      defaultValues.startedDate
        ? new Date(defaultValues.startedDate)
        : startOfDay(addDays(new Date(), 7)),
    );
    setEndedDate(
      defaultValues.endedDate
        ? new Date(defaultValues.endedDate)
        : startOfDay(addDays(new Date(), 7)),
    );
  }, [defaultValues]);

  const { data: categoryTree, isLoading: catLoading } = useListCategory();
  const { data: regionTree, isLoading: regLoading } = useListRegion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter as
      | HTMLButtonElement
      | HTMLInputElement
      | null;

    // 1) 무조건 FormData 생성
    const fd = new FormData(form);

    // 2) 눌린 버튼의 name/value를 수동으로 넣어준다
    if (submitter) {
      const name = submitter.getAttribute("name");
      const value = submitter.getAttribute("value");
      if (name && value != null) fd.set(name, value);
    }

    const isViewed = fd.get("isViewed") === "true";

    try {
      await onSubmit({
        post: { title, content, isViewed },
        project: {
          deadlineDate: toLocalDateTimeString(deadlineDate),
          startedDate: toLocalDateTimeString(startedDate),
          endedDate: toLocalDateTimeString(endedDate),
          hirerType,
          employmentType,
          salary: toUnit(SALARY_UNITS, salary.amount, salary.unit) ?? 0,
          personnel: personnel.amount,
          skillLevel: EXPERIENCE_OPTIONS.find((o) => o.id === skillLevel)!
            .level,
        },
        regionIds: selectedRegion,
        categoryIds: selectedCategory,
        skillIds: selectedSkillIds,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>프로젝트 게시글 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">서비스 제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="리뷰 제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">서비스 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="프로젝트 경험에 대해 자세히 작성해주세요..."
              rows={5}
              className="min-h-[15rem] max-h-[15rem] overflow-y-auto resize-y"
              required
            />
            <p className="text-xs text-muted-foreground">
              최소 50자 이상 작성해주세요 ({content.length} / 2000)
            </p>
          </div>

          {/* 지역 */}
          <div className="space-y-2">
            <Label htmlFor="title">지역 (다중선택 가능)</Label>
            <MultiChildSelect
              data={regionTree ?? []}
              value={selectedRegion}
              onChange={setSelectedRegion}
              className="max-h-64" // 필요 시 높이 조절
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="title">카테고리 (다중선택 가능)</Label>
            <MultiChildSelect
              data={categoryTree ?? []}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="max-h-64" // 필요 시 높이 조절
            />
          </div>

          {/* 기술 */}
          <div className="space-y-2">
            <Label htmlFor="title">기술 (다중선택 가능)</Label>
            <AsyncInfiniteMultiSelect
              value={selectedSkillIds}
              onChange={setSelectedSkillIds}
              allowCreate
              maxSelected={20}
              placeholder="스킬을 검색/선택하세요"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">고용인 유형</Label>
              <RadioGroup
                value={hirerType}
                onValueChange={(v: HirerType) => setHirerType(v)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="employer-individual" value="individual" />
                  <Label htmlFor="employer-individual">개인</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="employer-corporate" value="corporate" />
                  <Label htmlFor="employer-corporate">법인</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">고용유형</Label>
              <RadioGroup
                value={employmentType}
                onValueChange={(v: EmploymentType) => setEmploymentType(v)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="employment-onsite" value="onsite" />
                  <Label htmlFor="employment-onsite">상주</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    id="employment-outsourcing"
                    value="outsourcing"
                  />
                  <Label htmlFor="employment-outsourcing">외주</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">공고 마감일</Label>
              <CustomDatepicker
                value={deadlineDate}
                onChange={setDeadlineDate}
                minDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">프로젝트 시작일</Label>
              <CustomDatepicker
                value={startedDate}
                onChange={setStartedDate}
                minDate={new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">프로젝트 마감일</Label>
              <CustomDatepicker
                value={endedDate}
                onChange={setEndedDate}
                minDate={new Date()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">모집 인원</Label>
              <div className="flex items-center space-x-2">
                <NumberInput
                  value={personnel}
                  onChange={setPersonel}
                  placeholder="인원을 입력하세요."
                />
                <span>명</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">모집 경력</Label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="경력 선택" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.level} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">비용</Label>
            <div className="w-full flex items-center space-x-2">
              {employmentType === "onsite" && (
                <div className="whitespace-nowrap">월</div>
              )}
              <div className="flex-1 min-w-0">
                <UnitInput
                  value={salary}
                  onChange={setSalary}
                  unitOptions={SALARY_UNITS}
                  defaultUnit="krw"
                  placeholder="비용을 입력하세요."
                />
              </div>
            </div>
          </div>

          {/* 동의항목 */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-lg">
                아래 내용에 모두 동의합니다.
              </Label>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 도용하지 않은 순수 본인의 창작물 임을 확인합니다.</li>
              <li>
                • 신고 접수 시 해당 게시글이 매니저에 의해 임의 삭제 처리될 수
                있음에 동의합니다.
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
            >
              취소
            </Button>
            <Button
              type="submit"
              name="isViewed"
              value="false"
              disabled={
                !title.trim() ||
                !content.trim() ||
                content.length < 50 ||
                isSubmitting
              }
              className="flex-1"
            >
              {isSubmitting ? "임시저장 중..." : "임시저장"}
            </Button>
            <Button
              type="submit"
              name="isViewed"
              value="true"
              disabled={
                !title.trim() ||
                !content.trim() ||
                content.length < 50 ||
                isSubmitting
              }
              className="flex-1"
            >
              {isSubmitting ? "프로젝트 등록 중..." : "프로젝트 등록"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
