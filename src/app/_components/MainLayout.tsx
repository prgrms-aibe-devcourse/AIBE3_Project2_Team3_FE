"use client";

import { Badge } from "@/global/components/ui/badge";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/global/components/ui/tabs";
import { useMemo } from "react";

import Link from "next/link";

import {
  CheckCircle,
  MessageSquare,
  Search as SearchIcon,
  UserPlus,
} from "lucide-react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Heart,
  Star,
} from "lucide-react";
// 추가 아이콘
import { LifeBuoy, Shield } from "lucide-react";

import { ArrowCol } from "./ArrowCol";
import { QuickLink } from "./QuickLink";
import { StepCard } from "./StepCard";

// 임시: 인기 프리랜서/프로젝트 데이터 (좋아요 수 기준 정렬)
const mockTalents = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `프리랜서 ${i + 1}`,
  title: i % 2 ? "Full‑stack Developer" : "Product Designer",
  tags: i % 2 ? ["Next.js", "Spring", "AWS"] : ["Figma", "UX", "Brand"],
  rate: i % 2 ? "₩80,000/hr" : "₩60,000/hr",
  rating: 4.5 + (i % 5) * 0.1,
  likes: 10 + ((i * 7) % 97),
}));

const mockProjects = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: i % 2 ? "사내 대시보드 리뉴얼" : "모바일 온보딩 제작",
  budget: i % 2 ? "₩300~500만원" : "₩150~250만원",
  due: `D-${(i % 9) + 1}`,
  skills: i % 2 ? ["React", "NestJS"] : ["Lottie", "Figma"],
  likes: 5 + ((i * 11) % 83),
}));

export default function MainLayout() {
  const topTalents = useMemo(
    () => [...mockTalents].sort((a, b) => b.likes - a.likes).slice(0, 6),
    [],
  );
  const topProjects = useMemo(
    () => [...mockProjects].sort((a, b) => b.likes - a.likes).slice(0, 6),
    [],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 히어로 */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-5 md:py-14">
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              재능있는 프리랜서와{" "}
              <span className="text-pink-500">완벽한 매칭</span>
            </h1>
            <p className="mt-3 text-muted-foreground">
              전문 프리랜서들과 프로젝트를 연결하는 신뢰할 수 있는 플랫폼입니다.
              <br></br>로그인 없이도 둘러볼 수 있습니다.
            </p>
          </div>

          {/* 둘러보기(로그인 없이 접근 가능한 링크) */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">둘러보기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickLink
                href="/projects"
                icon={<ArrowUpRight className="h-4 w-4" />}
              >
                프로젝트 목록 보기
              </QuickLink>
              <QuickLink
                href="/freelancers"
                icon={<ArrowUpRight className="h-4 w-4" />}
              >
                프리랜서 목록 보기
              </QuickLink>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 인기 탭: 프리랜서 / 프로젝트 */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Tabs defaultValue="talents" className="w-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">인기</h2>
              <TabsList>
                <TabsTrigger value="talents">프리랜서</TabsTrigger>
                <TabsTrigger value="projects">프로젝트</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="talents" className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {topTalents.map((t) => (
                  <Card key={t.id} className="hover:shadow-sm">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{t.name}</div>
                          <div className="truncate text-sm text-muted-foreground">
                            {t.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Star className="h-4 w-4 text-black fill-yellow-500" />
                            {t.rating.toFixed(1)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Heart className="h-4 w-4 text-black fill-red-500" />
                            {t.likes}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {t.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>{t.rate}</div>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/freelancers/${t.id}`}>프로필</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {topProjects.map((p) => (
                  <Card key={p.id} className="hover:shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1 text-base">
                        {p.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{p.budget}</span>
                        <span>{p.due}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map((s) => (
                          <Badge key={s} variant="secondary">
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <Heart className="h-4 w-4 text-black fill-red-500" />
                          {p.likes}
                        </span>
                        <Button asChild size="sm">
                          <Link href={`/projects/${p.id}`}>상세보기</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="border-b bg-muted/10">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              <span className="text-pink-500">4단계</span>로 시작하는 프리랜싱
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              복잡한 절차 없이 간단하게 시작하실 수 있습니다
            </p>
          </div>

          {/* Desktop: 4카드 + 사이사이 화살표 (정렬 안정) */}
          <div className="mt-8 hidden lg:grid lg:grid-cols-11 lg:items-stretch lg:gap-4">
            <div className="col-span-2">
              <StepCard
                color="from-blue-500 to-indigo-500"
                step={1}
                title="회원가입"
                desc="간단한 정보 입력으로 프리랜서 또는 클라이언트로 가입하세요"
                icon={<UserPlus className="h-5 w-5 text-white" />}
              />
            </div>
            <ArrowCol />
            <div className="col-span-2">
              <StepCard
                color="from-green-500 to-emerald-500"
                step={2}
                title="매칭 찾기"
                desc="인기/좋아요 정렬과 필터로 딱 맞는 프로젝트나 프리랜서를 찾아보세요"
                icon={<SearchIcon className="h-5 w-5 text-white" />}
              />
            </div>
            <ArrowCol />
            <div className="col-span-2">
              <StepCard
                color="from-purple-500 to-fuchsia-500"
                step={3}
                title="소통하기"
                desc="실시간 채팅으로 세부사항을 논의하고 조건을 조율하세요"
                icon={<MessageSquare className="h-5 w-5 text-white" />}
              />
            </div>
            <ArrowCol />
            <div className="col-span-2">
              <StepCard
                color="from-orange-500 to-amber-500"
                step={4}
                title="프로젝트 완료"
                desc="안전 결제로 마무리하고 리뷰를 남겨 신뢰를 쌓으세요"
                icon={<CheckCircle className="h-5 w-5 text-white" />}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild className="px-6">
              <Link href="/auth/login">
                지금 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-6 text-xl font-semibold">
            왜 JOB+PICK을 선택해야 할까요?
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 신뢰 */}
            <Card className="hover:shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <Shield className="mt-0.5 h-6 w-6" />
                <div>
                  <div className="font-medium">검증된 프로필과 리뷰</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>신원 · 경력 · 작업물 검증</li>
                    <li>프로젝트 완료 후 실제 후기 공개</li>
                    <li>평점/뱃지로 품질 신호 명확화</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 안전 결제 */}
            <Card className="hover:shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <CheckCircle2 className="mt-0.5 h-6 w-6" />
                <div>
                  <div className="font-medium">에스크로 기반 안전 결제</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>마일스톤별 지급으로 리스크 최소화</li>
                    <li>조건 불충족 시 환불/조정</li>
                    <li>세금계산서/현금영수증 지원</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 매칭 */}
            <Card className="hover:shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <Clock className="mt-0.5 h-6 w-6" />
                <div>
                  <div className="font-medium">24시간 내 제안 수령</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>좋아요 기반 인기 정렬</li>
                    <li>자동 추천 & 즉시 지원</li>
                    <li>모바일 최적화 커뮤니케이션</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 지원 */}
            <Card className="hover:shadow-sm">
              <CardContent className="flex items-start gap-4 p-6">
                <LifeBuoy className="mt-0.5 h-6 w-6" />
                <div>
                  <div className="font-medium">프로젝트 전 과정 지원</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>요청서 템플릿/견적 가이드</li>
                    <li>분쟁 조정 & 표준 계약</li>
                    <li>전담 고객 지원 채널</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* 푸터 */}
      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} TalentLink</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:underline">
              개인정보처리방침
            </Link>
            <Link href="/fees" className="hover:underline">
              수수료
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
