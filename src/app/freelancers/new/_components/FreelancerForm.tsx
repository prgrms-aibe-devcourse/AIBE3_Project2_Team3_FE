"use client";

import { MultiChildSelect } from "@/global/components/ui/MultiChildSelect";
import { MultiSearchSelect } from "@/global/components/ui/MultiSearchSelect";
import { UnitInput } from "@/global/components/ui/UnitInput";
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
import { toUnit } from "@/global/lib/utils";
import { useState } from "react";

import { sample } from "./test";

export function FreelancerForm({ onSubmit, onCancel }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<number[]>([]);
  const [master, setMaster] = useState<{ id: number; name: string }[]>([
    { id: 1, name: "JavaScript" },
    { id: 2, name: "React" },
    { id: 3, name: "Angular" },
    { id: 4, name: "TypeScript" },
    { id: 5, name: "Node.js" },
    { id: 6, name: "Spring" },
  ]);
  const [period, setPeriod] = useState({ amount: 7, unit: "day" });
  const [salary, setSalary] = useState({ amount: 1, unit: "krw_10k" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitter = (e.nativeEvent as SubmitEvent).submitter as
      | HTMLButtonElement
      | HTMLInputElement
      | null;

    let fd: FormData;
    try {
      fd = new FormData(e.currentTarget);
    } catch {
      fd = new FormData(e.currentTarget);
      if (submitter) {
        const name = submitter.getAttribute("name");
        if (name) fd.append(name, submitter.getAttribute("value") ?? "");
      }
    }

    const isViewed = fd.get("isViewed") === "true";

    try {
      await onSubmit({
        post: { title, content, isViewed },
        freelancer: {
          salary: toUnit(SALARY_UNITS, salary.amount, salary.unit),
          period: toUnit(TIME_UNITS, period.amount, period.unit),
        },
        regionIds: selectedRegion,
        categoryIds: selectedCategory,
        skillIds: selectedSkill,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  async function handleCreate(
    name: string,
  ): Promise<{ id: number; name: string }> {
    // const res = await fetch("/api/skills", { method: "POST", body: JSON.stringify({ name }) });
    // const created = await res.json(); // { id, name }
    // setMaster((prev) => [...prev, created]);
    // return created;

    // 데모용 가짜 생성
    const created = { id: Math.max(0, ...master.map((s) => s.id)) + 1, name };
    setMaster((prev) => [...prev, created]);
    return created;
  }

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
              data={sample}
              value={selectedRegion}
              onChange={setSelectedRegion}
              className="max-h-64" // 필요 시 높이 조절
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="title">카테고리 (다중선택 가능)</Label>
            <MultiChildSelect
              data={sample}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="max-h-64" // 필요 시 높이 조절
            />
          </div>

          {/* 기술 */}
          <div className="space-y-2">
            <Label htmlFor="title">기술 (다중선택 가능)</Label>
            <MultiSearchSelect
              options={master}
              value={selectedSkill}
              onChange={setSelectedSkill}
              allowCreate={true}
              onCreate={handleCreate} // 자유입력 저장(없으면 로컬 임시ID)
              maxSelected={20}
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
