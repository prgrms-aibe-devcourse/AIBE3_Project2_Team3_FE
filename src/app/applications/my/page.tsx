"use client";

import {
  useListMyApp,
  useListReceivedApp,
} from "@/global/api/useApplicationQuery";
import LoadingScreen from "@/global/components/loading/loading";
import { Button } from "@/global/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { PaginationBar } from "@/global/components/ui/paginationBar";
import { useMyAppListStore } from "@/global/stores/useMyAppListStore";
import { useReceivedAppListStore } from "@/global/stores/useReceivedAppListStore";
import { ApplicationWithUserDto } from "@/global/types/application.types";
import { useState } from "react";

import ApplicationRow from "./_components/AppRow";

export default function ApplicationsPage() {
  const [tab, setTab] = useState<"my" | "received">("my");
  const myQ = useListMyApp(tab === "my");
  const rcQ = useListReceivedApp(tab === "received");

  const data = tab === "my" ? myQ.data : rcQ.data;
  const isLoading = tab === "my" ? myQ.isLoading : rcQ.isLoading;

  // 페이지네이션: 탭별 store 사용
  const { page: myPage, setPage: setMyPage } = useMyAppListStore();
  const { page: rcPage, setPage: setRcPage } = useReceivedAppListStore();
  if (!data)
    return (
      <LoadingScreen
        message="데이터를 불러오는 중입니다"
        tips={["잠시만 기다려 주세요"]}
      />
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">내 지원 관리</div>
        <div className="flex gap-2">
          <Button
            variant={tab === "my" ? "default" : "outline"}
            onClick={() => setTab("my")}
          >
            내가 지원한 목록
          </Button>
          <Button
            variant={tab === "received" ? "default" : "outline"}
            onClick={() => setTab("received")}
          >
            내가 받은 목록
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {tab === "my" ? "내가 지원한 목록" : "내가 지원받은 목록"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y">
            {/* 리스트 */}
            {isLoading ? (
              <div>로딩중…</div>
            ) : (
              <div className="flex flex-col">
                {data?.content?.map((it: ApplicationWithUserDto, i) => (
                  <ApplicationRow
                    key={it.id}
                    item={it}
                    tab={tab}
                    index={
                      data.page.totalElements -
                      i -
                      data.page.page * data.page.size
                    }
                  />
                ))}
              </div>
            )}
            {!isLoading && data?.content?.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">
                목록이 비어있습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {!!data && (
            <div className="text-center pt-8">
              <PaginationBar
                pageIndex={tab === "my" ? myPage : rcPage}
                pageCount={data.page.totalPages}
                onPageIndexChange={tab === "my" ? setMyPage : setRcPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
