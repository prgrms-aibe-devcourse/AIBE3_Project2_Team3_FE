"use client";

import { Button } from "@/global/components/ui/button";
import { Card, CardContent, CardHeader } from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import { toast } from "@/global/hooks/useToast";
import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function SandboxFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message =
    searchParams.get("message") ?? "결제가 취소되었거나 실패했습니다.";
  const freelancerId = searchParams.get("freelancerId");

  useEffect(() => {
    toast({ title: "결제 실패", description: message, open: true });
  }, [message]);

  return (
    <div className="container py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">결제 실패</h1>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                결제가 정상적으로 완료되지 않았습니다.
              </p>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => {
                    if (freelancerId) router.replace(`/offers/${freelancerId}`);
                    else router.replace("/freelancers");
                  }}
                >
                  돌아가기
                </Button>

                <Button variant="outline" onClick={() => router.replace("/")}>
                  홈으로
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
