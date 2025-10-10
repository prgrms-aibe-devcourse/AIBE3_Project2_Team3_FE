"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { formatCustomDuration } from "@/global/lib/utils";
import { FreelancerDto } from "@/global/types/freelancer.types";
import { MouseEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { Clock, Eye, Heart, MapPin, Star, Tag } from "lucide-react";

interface FreelancerCardProps {
  freelancer: FreelancerDto;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();

  const clickCard = () => {
    router.replace(`/freelancers/${freelancer.id}`);
  };

  const clickFavorite = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer"
      onClick={clickCard}
    >
      <CardHeader className="pb-4">
        {/* 카테고리 */}
        <div className="flex items-center gap-2 mb-2">
          <Tag className="h-4 w-4 mr-1" />
          {freelancer.categories.slice(0, 4).map((category) => (
            <Badge key={category.id} variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {freelancer.categories.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{freelancer.categories.length - 4}
            </Badge>
          )}
        </div>
        {/* 제목 내용 */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
              {freelancer.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
              {freelancer.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 border-1 border-transparent hover:cursor-pointer hover:border-black"
            onClick={(e) => clickFavorite(e)}
          >
            <Heart
              className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-primary" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 기술 */}
        <div className="flex flex-wrap gap-2">
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
              <AvatarImage src={"https://picsum.photos/200"} />
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
              {0}
            </div>
            <div>{0}명 제안</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
