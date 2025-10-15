"use client";

import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function SandboxSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId") ?? "-";
  const orderName = searchParams.get("orderName") ?? "-";
  const customerName = searchParams.get("customerName") ?? "-";
  const customerEmail = searchParams.get("customerEmail") ?? "-";
  const postId = searchParams.get("postId") ?? "-";
  const amount = searchParams.get("amount") ?? "-";

  useEffect(() => {
    toast({
      title: "결제 완료",
      description: "결제가 정상적으로 완료되었습니다.",
      open: true,
    });
  }, []);

  return (
    <div className="container py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">결제 완료</h1>
                <p className="text-sm text-muted-foreground">
                  결제가 성공적으로 완료되었습니다.
                </p>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-muted-foreground">주문명</div>
                <div className="text-sm font-medium">{orderName}</div>

                <div className="text-sm text-muted-foreground">고객명</div>
                <div className="text-sm font-medium">{customerName}</div>

                <div className="text-sm text-muted-foreground">고객 이메일</div>
                <div className="text-sm font-medium">{customerEmail}</div>

                <div className="text-sm text-muted-foreground">결제금액</div>
                <div className="text-sm font-medium">{amount}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 pt-4 mt-4">
          <Button
            onClick={() => {
              if (postId && postId !== "-")
                router.replace(`/freelancers/${postId}`);
              else router.replace("/");
            }}
          >
            프리랜서 페이지로 이동
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (postId && postId !== "-") router.replace(`/offers/${postId}`);
              else router.replace("/");
            }}
          >
            오퍼 목록으로
          </Button>
        </div>
      </div>
    </div>
  );
}
