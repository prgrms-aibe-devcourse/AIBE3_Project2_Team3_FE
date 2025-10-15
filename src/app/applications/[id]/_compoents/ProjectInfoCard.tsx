"use client";

import { Badge } from "@/global/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { ProjectDto } from "@/global/types/project.types";
import { format } from "date-fns";

import { MapPin, Tag } from "lucide-react";

export function ProjectInfoCard({ project }: { project: ProjectDto }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold mb-2">프로젝트 정보</h1>
        </div>
        <Separator />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 mr-1" />
            {project.categories.slice(0, 4).map((c) => (
              <Badge key={c.id} variant="secondary" className="text-xs">
                {c.name}
              </Badge>
            ))}
            {project.categories.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.categories.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {project.regions.slice(0, 4).map((r) => (
              <Badge key={r.id} variant="secondary" className="text-xs">
                {r.name}
              </Badge>
            ))}
            {project.regions.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.regions.length - 4}
              </Badge>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>

          <div className="space-y-4">
            <section>
              <h3 className="font-semibold mb-1">진행 방식</h3>
              <p className="text-muted-foreground">
                {project.employmentType === "onsite"
                  ? "상주·원격: 일정 기간 동안 프리랜서를 채용해요"
                  : "외주: 약속된 과업을 일정 기간 내에 완성해 결과물을 받아요"}
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-1">의뢰인 유형</h3>
              <p className="text-muted-foreground">
                {project.hirerType === "individual"
                  ? "개인"
                  : "기업(법인·개인사업자·예비창업자)"}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <h3 className="font-semibold mb-1">공고 마감일</h3>
                <p className="text-muted-foreground">
                  {format(project.deadlineDate, "yyyy-MM-dd")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">프로젝트 시작일</h3>
                <p className="text-muted-foreground">
                  {format(project.startedDate, "yyyy-MM-dd")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">종료 예정일</h3>
                <p className="text-muted-foreground">
                  {format(project.endedDate, "yyyy-MM-dd")}
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold mb-1">프로젝트 설명</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.content}
              </p>
            </section>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
