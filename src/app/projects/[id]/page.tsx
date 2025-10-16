"use client";

import {
  useDetailProject,
  useToggleLikeProject,
  useViewProject,
} from "@/global/api/useProjectQuery";
import LoadingScreen from "@/global/components/loading/loading";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { DEFAULT_AVATAR } from "@/global/consts";
import { formatCustomDuration, formatTimeAgo } from "@/global/lib/utils";
import { format } from "date-fns";
import { use, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MapPin,
  Star,
  Tag,
  Users,
} from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data: project, isLoading } = useDetailProject(id);
  const { mutate: likeMutate } = useToggleLikeProject(id);
  const { mutate: viewMutate } = useViewProject(id);
  const [isFavorited, setIsFavorited] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();
  const firedRef = useRef(false);
  useEffect(() => {
    if (!project?.id) return;

    // StrictMode 2회 실행 가드
    if (firedRef.current) return;
    firedRef.current = true;

    // (선택) 세션 당 1회만 증가
    const key = `viewed:project:${project.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    viewMutate(project.id, {
      onSuccess: (res) => setViewCount(res.data.viewCount),
    });
  }, [project?.id, viewMutate]);
  useEffect(() => {
    if (!project) return;
    setIsFavorited(project.liked);
    setViewCount(project.viewCount);
    setLikeCount(project.likeCount);
  }, [project]);
  if (!project)
    return (
      <LoadingScreen
        message="데이터를 불러오는 중입니다"
        tips={["잠시만 기다려 주세요"]}
      />
    );
  return (
    <div className="py-4 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
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
                  <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
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
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatTimeAgo(project.createdDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      고용기간:&nbsp;
                      {formatCustomDuration(
                        project.startedDate,
                        project.endedDate,
                      )}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {0}명 지원
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {viewCount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-primary" : ""}`}
                    />
                    {likeCount ? likeCount : ""}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">필요 스킬</h3>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">프로젝트 설명</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {project.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-primary">
                {project.salary.toLocaleString()}원
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                마감일: {format(project.deadlineDate, "yyyy-MM-dd")}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full cursor-pointer"
                onClick={() => router.replace(`/applications/${project.id}`)}
              >
                지원하기
              </Button>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>클라이언트 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={project.author.profileImageUrl || DEFAULT_AVATAR}
                  />
                  <AvatarFallback>{"이미지"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{project.author.nickname}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {0} ({0}개 리뷰)
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">가입일</span>
                  <span>
                    {format(project.author.createdDate, "yyyy-MM-dd")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">완료 프로젝트</span>
                  <span>{0}개</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
