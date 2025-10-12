"use client";

import { useDetailFreelancer } from "@/global/api/useFreelancerQuery";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/global/components/ui/tabs";
import { formatCustomDuration, formatTimeAgo } from "@/global/lib/utils";
import { format } from "date-fns";
import { use, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Calendar,
  Clock,
  Eye,
  Heart,
  ListChecks,
  MapPin,
  MessageCircle,
  Star,
  Tag,
  Users,
} from "lucide-react";

export default function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data: freelancer } = useDetailFreelancer(id);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();
  if (!freelancer)
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
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 mr-1" />
                    {freelancer.categories.slice(0, 4).map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="text-xs"
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
                  <h1 className="text-2xl font-bold mb-2">
                    {freelancer.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {freelancer.regions.slice(0, 4).map((region) => (
                      <Badge
                        key={region.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {region.name}
                      </Badge>
                    ))}
                    {freelancer.regions.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.regions.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatTimeAgo(freelancer.createdDate)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      작업기간:&nbsp;
                      {formatCustomDuration(0, freelancer.period)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {0}개 제안
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{0}</span>
                      <span className="text-muted-foreground ml-1">
                        ({0}개 리뷰)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {0}
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
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-6">
                <Avatar className="h-22 w-22">
                  <AvatarImage src={"https://picsum.photos/200"} />
                  <AvatarFallback className="text-2xl">
                    {"이미지"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">
                    {freelancer.author.nickname}
                  </h1>
                  <div className="flex items-center space-x-6 text-sm mb-2">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(freelancer.author.createdDate, "yyyy-MM-dd")} 가입
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <ListChecks className="h-4 w-4 mr-1" />
                      {0}개 완료
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
              <TabsTrigger value="reviews">리뷰</TabsTrigger>
              <TabsTrigger value="experience">작성자 게시글</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>보유 스킬</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {freelancer.content}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* {freelancer.portfolio.map((item) => (
                <Card key={item.id}>
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img
                      src={
                        item.image || "/placeholder.svg?height=200&width=300"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))} */}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {/* {freelancer.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-medium">{review.client}</div>
                      <div className="text-sm text-muted-foreground">
                        {review.project}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.date}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))} */}
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>작성자가 올린 게시글</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* {freelancer.education.map((edu, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                    <div>
                      <div className="font-medium">{edu.degree}</div>
                      <div className="text-sm text-muted-foreground">
                        {edu.school}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {edu.year}
                      </div>
                    </div>
                  </div>
                ))} */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex space-x-2 items-baseline">
                <span className="text-[1.5rem] pr-1">
                  {freelancer.salary.toLocaleString()}원
                </span>
                <p className="text-gray-600">(VAT 포함가)</p>
              </div>
              <Button
                variant="outline"
                className="w-full bg-transparent cursor-pointer"
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                전문가에게 문의하기
              </Button>
              <Button
                className="w-full cursor-pointer"
                onClick={() => router.replace(`/offers/${freelancer.id}`)}
              >
                구매하기
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">완료 프로젝트</span>
                <span className="font-medium">{0}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">재고용률</span>
                <span className="font-medium">{0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">정시 완료율</span>
                <span className="font-medium">{0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">응답 기간</span>
                <span className="font-medium">{"알수없음"} 일</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
