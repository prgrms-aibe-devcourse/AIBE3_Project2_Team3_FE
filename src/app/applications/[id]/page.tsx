"use client";

import { useCreateApplication } from "@/global/api/useApplicationQuery";
import { useDetailProject } from "@/global/api/useProjectQuery";
import LoadingScreen from "@/global/components/loading/loading";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { FileUpload } from "@/global/components/ui/file-upload";
import { Label } from "@/global/components/ui/label";
import { Separator } from "@/global/components/ui/separator";
import { Textarea } from "@/global/components/ui/textarea";
import { toast } from "@/global/hooks/useToast";
import { format } from "date-fns";
import { use, useState } from "react";

import { useRouter } from "next/navigation";

import { MapPin, Tag } from "lucide-react";

export default function ApplicationWritePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data: project, isLoading } = useDetailProject(id);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [salary, setSalary] = useState<number>(0);
  const [period, setPeriod] = useState<number>(0);
  const router = useRouter();
  const { mutateAsync } = useCreateApplication();
  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  if (isLoading || !project)
    return (
      <LoadingScreen
        message="데이터를 불러오는 중입니다"
        tips={["잠시만 기다려 주세요"]}
      />
    );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (content.trim().length < 50) {
      toast({
        title: "지원 내용이 짧습니다",
        description: "최소 50자 이상 작성해주세요",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }

    if (salary !== 0 && Number(salary) < 0) {
      toast({
        title: "유효하지 않은 급여",
        description: "급여는 0 이상이어야 합니다.",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }

    if (period !== 0 && Number(period) < 1) {
      toast({
        title: "유효하지 않은 기간",
        description: "기간은 1 이상이어야 합니다.",
        open: true,
      });
      setIsSubmitting(false);
      return;
    }

    const fd = new FormData();
    const reqBody = {
      postId: project.id,
      content,
      salary,
      period,
    };
    fd.append(
      "reqBody",
      new Blob([JSON.stringify(reqBody)], { type: "application/json" }),
    );

    attachments.forEach((file) => fd.append("files", file));

    try {
      await mutateAsync(fd);
      toast({
        title: "지원 완료",
        description: "지원이 정상적으로 등록되었습니다.",
        open: true,
      });
      router.replace(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      toast({
        title: "지원 실패",
        description: "서버와 통신 중 오류가 발생했습니다.",
        open: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="py-4 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문목록 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">지원하기</h1>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-2">프로젝트 정보</h1>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 mr-1" />
                      {project.categories.slice(0, 4).map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {category.name}
                        </Badge>
                      ))}
                      {project.categories.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.categories.length - 4}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.regions.slice(0, 4).map((region) => (
                        <Badge
                          key={region.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {region.name}
                        </Badge>
                      ))}
                      {project.regions.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.regions.length - 4}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">진행 방식</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.employmentType == "onsite"
                        ? "상주·원격: 일정 기간 동안 프리랜서를 채용해요"
                        : "외주: 약속된 과업을 일정 기간 내에 완성해 결과물을 받아요"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">의뢰인 유형</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.hirerType == "individual"
                        ? "개인"
                        : "기업(법인·개인사업자·예비창업자)"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">공고 마감일</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {format(project.deadlineDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">프로젝트 시작일</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {format(project.startedDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">프로젝트 종료 예정일</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {format(project.endedDate, "yyyy-MM-dd")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-3">프로젝트 설명</h3>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground leading-relaxed">
                      {project.content}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <Card>
            <CardContent className="pt-2 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 희망 급여 및 기간 */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">희망 급여</Label>
                    <input
                      id="salary"
                      type="number"
                      value={salary}
                      onChange={(e) =>
                        setSalary(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
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
                      value={period}
                      onChange={(e) =>
                        setPeriod(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                      placeholder="예: 3"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-muted-foreground">
                      프로젝트 참여 가능 기간(개월)
                    </p>
                  </div>
                </div>
                {/* 지원 내용 */}
                <div className="space-y-2">
                  <Label htmlFor="content">지원 내용</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="공고와 관련된 이력에 대해 자세히 적어주시면 제안 채택 가능성이 높아져요."
                    rows={5}
                    className="min-h-[15rem] max-h-[15rem] overflow-y-auto resize-y"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    최소 50자 이상 작성해주세요 ({content.length} / 2000)
                  </p>
                </div>
                {/* 포트폴리오 */}
                <div className="space-y-2 mt-4">
                  <Label>첨부파일 (선택사항)</Label>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                    multiple={true}
                    maxSize={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    프로젝트 결과물이나 관련 자료를 첨부할 수 있습니다 (최대
                    5MB)
                  </p>
                </div>
                <Separator />
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  size="lg"
                >
                  {isSubmitting ? "지원하는 중..." : "지원하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
