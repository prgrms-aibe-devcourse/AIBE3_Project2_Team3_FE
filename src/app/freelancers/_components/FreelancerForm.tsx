"use client";

import { useListCategory } from "@/global/api/useCategoryQuery";
import { useListRegion } from "@/global/api/useRegionQuery";
import { UnitInput } from "@/global/components/custom-input/UnitInput";
import { AsyncInfiniteMultiSelect } from "@/global/components/multi-select/InfiniteMultiSelect";
import { MultiChildSelect } from "@/global/components/multi-select/MultiChildSelect";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Checkbox } from "@/global/components/ui/checkbox";
import { FileUpload } from "@/global/components/ui/file-upload";
import { Input } from "@/global/components/ui/input";
import { Label } from "@/global/components/ui/label";
import { Textarea } from "@/global/components/ui/textarea";
import { SALARY_UNITS, TIME_UNITS } from "@/global/consts";
import { fromUnit, toUnit } from "@/global/lib/utils";
import {
  FreelancerDto,
  FreelancerWriteReqBody,
} from "@/global/types/freelancer.types";
import { useEffect, useState } from "react";

type FreelancerFormProps = {
  onSubmit: (param: FreelancerWriteReqBody) => void;
  onCancel: () => void;
  defaultValues?: FreelancerDto;
};
export function FreelancerForm({
  onSubmit,
  onCancel,
  defaultValues,
}: FreelancerFormProps) {
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
  const [period, setPeriod] = useState(
    defaultValues?.period
      ? {
          amount: fromUnit(TIME_UNITS, defaultValues.period, "hour"),
          unit: "hour",
        }
      : { amount: 7, unit: "day" },
  );
  const [salary, setSalary] = useState(
    defaultValues?.salary
      ? {
          amount: fromUnit(SALARY_UNITS, defaultValues.salary, "krw"),
          unit: "krw",
        }
      : { amount: 1, unit: "krw_10k" },
  );
  const [attachments, setAttachments] = useState<File[]>([]);
  const { data: categoryTree, isLoading: catLoading } = useListCategory();
  const { data: regionTree, isLoading: regLoading } = useListRegion();

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
      defaultValues?.categories
        ? defaultValues.categories.map((category) => category.id)
        : [],
    );
    setSelectedSkillIds(
      defaultValues?.skills
        ? defaultValues.skills.map((skill) => skill.id)
        : [],
    );
    setPeriod(
      defaultValues.period
        ? {
            amount: fromUnit(TIME_UNITS, defaultValues.period, "hour"),
            unit: "hour",
          }
        : { amount: 7, unit: "day" },
    );
    setSalary(
      defaultValues.salary
        ? {
            amount: fromUnit(SALARY_UNITS, defaultValues.salary, "krw"),
            unit: "krw",
          }
        : { amount: 1, unit: "krw_10k" },
    );
  }, [defaultValues]);

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
        freelancer: {
          salary: toUnit(SALARY_UNITS, salary.amount, salary.unit) ?? 0,
          period: toUnit(TIME_UNITS, period.amount, period.unit) ?? 0,
        },
        regionIds: selectedRegion,
        categoryIds: selectedCategory,
        skillIds: selectedSkillIds,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>프리랜서 게시글 작성</CardTitle>
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

          {/* 작업 기간 */}
          <div className="space-y-2">
            <Label htmlFor="title">작업기간</Label>
            <UnitInput
              value={period}
              onChange={setPeriod}
              unitOptions={TIME_UNITS}
              defaultUnit="day"
              placeholder="기간을 입력하세요."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">비용</Label>
            <UnitInput
              value={salary}
              onChange={setSalary}
              unitOptions={SALARY_UNITS}
              defaultUnit="krw"
              placeholder="비용을 입력하세요."
            />
          </div>

          {/* 포트폴리오 */}
          <div className="space-y-2">
            <Label>첨부파일 (선택사항)</Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              multiple={true}
              maxSize={5}
            />
            <p className="text-xs text-muted-foreground">
              프로젝트 결과물이나 관련 자료를 첨부할 수 있습니다 (최대 5MB)
            </p>
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
              {isSubmitting ? "프리랜서 등록 중..." : "프리랜서 등록"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
