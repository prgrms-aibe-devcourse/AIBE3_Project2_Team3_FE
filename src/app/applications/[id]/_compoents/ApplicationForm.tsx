"use client";

import {
  useCreateApplication,
  useModifyApplication,
} from "@/global/api/useApplicationQuery";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent } from "@/global/components/ui/card";
import { FileUpload } from "@/global/components/ui/file-upload";
import { Label } from "@/global/components/ui/label";
import { Separator } from "@/global/components/ui/separator";
import { Textarea } from "@/global/components/ui/textarea";
import { DAY_TO_MILLES } from "@/global/consts";
import { toast } from "@/global/hooks/useToast";
import { ApplicationDto } from "@/global/types/application.types";
import { ExistingFile } from "@/global/types/common.types";
import { useEffect, useState } from "react";

export function ApplicationFormCard({
  projectId,
  application, // 있으면 수정 모드
  onSuccess, // 완료 후 콜백
  onCancel,
}: {
  projectId: number;
  application?: ApplicationDto;
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const isEdit = !!application?.id;

  const [content, setContent] = useState<string>("");
  const [salary, setSalary] = useState<number>(0);
  const [periodDays, setPeriodDays] = useState<number>(0); // 폼은 "일"
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]); // 서버가 준 기존 파일
  const [removedFileIds, setRemovedFileIds] = useState<Set<number>>(new Set());

  const { mutateAsync: createApp } = useCreateApplication();
  const { mutateAsync: modifyApp } = useModifyApplication();

  useEffect(() => {
    if (!isEdit || !application) return;
    setContent(application.content ?? "");
    setSalary(application.salary ?? 0);
    setPeriodDays(
      application.period
        ? Math.max(0, Math.floor(application.period / DAY_TO_MILLES))
        : 0,
    );
    setExistingFiles(application.files);
  }, [isEdit, application]);

  const toggleRemove = (id: number) =>
    setRemovedFileIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 간단 검증
    if (content.trim().length < 50) {
      toast({
        title: "지원 내용이 짧습니다",
        description: "최소 50자 이상 작성해주세요",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (salary !== 0 && salary < 0) {
      toast({
        title: "유효하지 않은 급여",
        description: "급여는 0 이상이어야 합니다.",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }
    if (periodDays !== 0 && periodDays < 1) {
      toast({
        title: "유효하지 않은 기간",
        description: "기간은 1일 이상이어야 합니다.",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }

    const reqBody = {
      postId: projectId,
      content,
      salary,
      period: periodDays * DAY_TO_MILLES,
    };

    const fd = new FormData();
    fd.append(
      "reqBody",
      new Blob([JSON.stringify(reqBody)], { type: "application/json" }),
    );
    attachments.forEach((f) => fd.append("files", f));
    Array.from(removedFileIds).forEach((id) =>
      fd.append("removeIds", String(id)),
    );

    try {
      if (isEdit && application?.id) {
        await modifyApp({ id: application.id, formData: fd });
        toast({
          title: "수정 완료",
          description: "지원서가 수정되었습니다.",
          open: true,
        });
      } else {
        await createApp(fd);
        toast({
          title: "지원 완료",
          description: "지원이 정상적으로 등록되었습니다.",
          open: true,
        });
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
      toast({
        title: isEdit ? "수정 실패" : "지원 실패",
        description: "서버와 통신 중 오류가 발생했습니다.",
        open: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">희망 급여</Label>
              <input
                id="salary"
                type="number"
                value={salary}
                onChange={(e) =>
                  setSalary(e.target.value === "" ? 0 : Number(e.target.value))
                }
                placeholder="예: 3000000"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-muted-foreground">
                월 급여 또는 총액 (원)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">희망 기간</Label>
              <input
                id="period"
                type="number"
                value={periodDays}
                onChange={(e) =>
                  setPeriodDays(
                    e.target.value === "" ? 0 : Number(e.target.value),
                  )
                }
                placeholder="예: 30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-muted-foreground">
                프로젝트 참여 가능 기간(일)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">지원 내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공고와 관련된 이력에 대해 자세히 적어주세요. (50자 이상)"
              rows={5}
              className="min-h-[15rem] max-h-[15rem] overflow-y-auto resize-y"
              required
            />
            <p className="text-xs text-muted-foreground">
              최소 50자 이상 작성해주세요 ({content.length} / 2000)
            </p>
          </div>

          <div className="space-y-2">
            <Label>첨부파일 (선택사항)</Label>
            <ul className="space-y-2">
              {existingFiles.map((f) => {
                const removed = removedFileIds.has(f.id);
                return (
                  <li key={f.id} className="flex items-center justify-between">
                    <a
                      href={f.url}
                      target="_blank"
                      className={removed ? "line-through opacity-60" : ""}
                    >
                      {f.fileName}
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleRemove(f.id)}
                      className="text-sm"
                    >
                      {removed ? "복구" : "삭제"}
                    </button>
                  </li>
                );
              })}
              {!existingFiles.length && (
                <li className="text-sm text-muted-foreground">
                  기존 파일 없음
                </li>
              )}
            </ul>
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              multiple
              maxSize={5}
            />
            <p className="text-xs text-muted-foreground">최대 5MB</p>
          </div>

          <Separator />
          <Button type="submit" className="w-full" size="lg">
            {isSubmitting
              ? isEdit
                ? "수정 중..."
                : "지원하는 중..."
              : isEdit
                ? "수정하기"
                : "지원하기"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={onCancel}
          >
            취소
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
