"use client";

import LoadingScreen from "@/global/components/loading/loading";
import { toast } from "@/global/hooks/useToast";
import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function SandboxSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const freelancerId = searchParams.get("freelancerId");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const paymentKey = searchParams.get("paymentKey");

    if (!orderId || !amount || !paymentKey) {
      toast({
        title: "결제 실패",
        description: "필수 결제 정보가 누락되었습니다.",
        open: true,
      });

      const targetPath = freelancerId
        ? `/offers/${freelancerId}`
        : `/freelancers`;
      router.replace(targetPath);
      return;
    }

    toast({
      title: "결제 완료",
      description: "결제가 정상적으로 완료되었습니다.",
      open: true,
    });

    router.replace("/offers/my");
  }, [searchParams, router]);

  return (
    <div>
      <LoadingScreen
        message={"결제를 확인하는 중입니다"}
        tips={["잠시만 기다려 주세요"]}
      />
    </div>
  );
}
