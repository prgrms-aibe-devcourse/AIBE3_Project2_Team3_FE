"use client";

import { useToggleLikeFreelancer } from "@/global/api/useFreelancerQuery";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { DEFAULT_AVATAR } from "@/global/consts";
import { toast } from "@/global/hooks/useToast";
import { formatCustomDuration } from "@/global/lib/utils";
import { FreelancerDto } from "@/global/types/freelancer.types";
import { MouseEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { Clock, Eye, Heart, MapPin, Puzzle, Star, Tag } from "lucide-react";

interface FreelancerCardProps {
  freelancer: FreelancerDto;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const [isFavorited, setIsFavorited] = useState(freelancer.liked);
  const [likeCount, setLikeCount] = useState(freelancer.likeCount);
  const { mutate } = useToggleLikeFreelancer(freelancer.id);
  const router = useRouter();

  const clickCard = () => {
    router.replace(`/freelancers/${freelancer.id}`);
  };

  const clickFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const prev = isFavorited; // ← 현재 값 스냅샷
    setIsFavorited((p) => !p);
    mutate(freelancer.id, {
      onSuccess: (res) => {
        setIsFavorited(res.data.liked);
        setLikeCount(res.data.likeCount);
      },
      onError: (res) => {
        setIsFavorited(prev);
        toast({
          title: "실패",
          description: res.message,
        });
      },
    });
  };
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer"
      onClick={clickCard}
    >
      <CardHeader className="pb-4">
        {/* 카테고리 + 우측 하트 */}
        <div className="flex items-center gap-2 mb-2">
          {/* 왼쪽: 태그 + 배지들 (여기가 넓어짐) */}
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <Tag className="h-4 w-4 mr-1 shrink-0" />
            {freelancer.categories.slice(0, 4).map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="text-xs [overflow-wrap:anywhere]"
              >
                {category.name}
              </Badge>
            ))}
            {freelancer.categories.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.categories.length - 4}
              </Badge>
            )}
          </div>

          {/* 오른쪽: 즐겨찾기 버튼 (항상 우상단) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isFavorited ? "즐겨찾기 해제" : "즐겨찾기"}
            aria-pressed={isFavorited}
            className="shrink-0 self-start h-8 w-8"
            onClick={(e) => {
              e.stopPropagation(); // 카드 onClick 방지
              clickFavorite(e);
            }}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-primary" : ""}`}
            />
            {likeCount ? likeCount : ""}
          </Button>
        </div>

        {/* 제목/내용 */}
        <div className="flex items-start justify-between">
          {/* ✅ 텍스트 영역: flex-1 + min-w-0 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 break-words">
              {freelancer.title}
            </h3>
            {/* ✅ 초장문/연속문자 대비: break-all 로 더 강하게도 가능 */}
            <p className="text-muted-foreground text-sm mt-2 line-clamp-3 break-all overflow-hidden">
              {freelancer.content}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto space-y-3">
        {/* 지역 */}
        <div className="flex text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {freelancer.regions.slice(0, 4).map((region) => (
              <Badge key={region.id} variant="secondary" className="text-xs">
                {region.name}
              </Badge>
            ))}
            {freelancer.regions.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{freelancer.regions.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* 기술 */}
        <div className="flex flex-wrap gap-2">
          <Puzzle className="h-4 w-4 mr-2" />
          {freelancer.skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {freelancer.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* 제작 기간 */}
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          작업 기간: {formatCustomDuration(0, freelancer.period)}
        </div>

        {/* 가격 */}
        <div className="text-lg font-semibold text-primary">
          {freelancer.salary.toLocaleString()} 원
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={freelancer.author.profileImageUrl || DEFAULT_AVATAR}
              />
              <AvatarFallback>{"이미지"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">
                {freelancer.author.nickname}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {0} ({0})
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {freelancer.viewCount}
            </div>
            <div>{0}명 제안</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
