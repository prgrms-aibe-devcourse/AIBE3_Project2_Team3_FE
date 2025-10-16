"use client";

import { useCreateOffer } from "@/global/api/useOfferQuery";
import { Button } from "@/global/components/ui/button";
import { toast } from "@/global/hooks/useToast";
import { useTossWidgetStore } from "@/global/stores/useTossWidgetStore";
import { FreelancerDto } from "@/global/types/freelancer.types";

type TossPaymentsButtonProps = {
  freelancer: FreelancerDto;
  qty: number;
};
export function TossPaymentsButton({
  freelancer,
  qty,
}: TossPaymentsButtonProps) {
  const { ready, widgets } = useTossWidgetStore((state) => state);
  const createOffer = useCreateOffer();
  return (
    <Button
      className="w-full cursor-pointer"
      size="lg"
      disabled={!ready}
      onClick={async () => {
        try {
          /**
           * 결제 요청
           * 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
           * 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
           * @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
           */
          await createOffer.mutateAsync({
            postId: Number(freelancer.id),
            amount: Number(qty),
          });

          await widgets?.requestPayment({
            orderId: crypto.randomUUID(),
            orderName: `${freelancer.title} ${qty}건`,
            customerName: "김토스",
            customerEmail: "customer123@gmail.com",
            successUrl: `${window.location.origin}/sandbox/success?freelancerId=${freelancer.id}`,
            failUrl: `${window.location.origin}/sandbox/fail?freelancerId=${freelancer.id}`,
          });
        } catch (error) {
          toast({
            title: "결제 실패",
            description: "결제 요청에 실패했습니다.",
            open: true,
          });
        }
      }}
    >
      결제하기
    </Button>
  );
}
