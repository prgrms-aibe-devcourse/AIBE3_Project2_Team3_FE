"use client";

import { useDetailFreelancer } from "@/global/api/useFreelancerQuery";
import LoadingScreen from "@/global/components/loading/loading";
import { QuantityStepper } from "@/global/components/ui/QuantitySetpper";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/global/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/global/components/ui/card";
import { Separator } from "@/global/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/global/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/global/components/ui/tooltip";
import { calcFee, calcTotals, formatCustomDuration } from "@/global/lib/utils";
import { use, useEffect, useMemo, useState } from "react";

import { HelpCircle } from "lucide-react";

import { TossPayments } from "./_components/TossPayments";
import { TossPaymentsButton } from "./_components/TossPaymentsButton";

type Item = {
  id: string;
  name: string;
  unitDays: number;
  unitPrice: number;
  qty: number;
};
export default function OfferWritePage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = use(params);
  const { data: freelancer, isLoading } = useDetailFreelancer(id);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!freelancer) return;
    setItems([
      {
        id: "freelancer", // 고유키
        name: freelancer.title,
        unitDays: Number(freelancer.period),
        unitPrice: Number(freelancer.salary),
        qty: 1,
      },
    ]);
  }, [freelancer]);

  const handleQtyChange = (id: string, qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
  };

  const rows = useMemo(() => {
    return items.map((it) => {
      const days = it.unitDays * it.qty;
      const price = it.unitPrice * it.qty;
      return { ...it, days, price };
    });
  }, [items]);

  if (isLoading || !freelancer)
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
          {/* 주문목록 */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">결제하기</h1>
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold mb-2">주문 내역</h1>
                <div className="flex items-start space-x-6 mb-4">
                  <div className="flex flex-col flex-1 space-y-3">
                    <h1 className="text-2xl font-bold mb-2">
                      {freelancer.title}
                    </h1>
                    <div className="flex items-center space-x-6 text-sm mb-2">
                      <div className="flex items-center text-muted-foreground space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={"https://picsum.photos/200"} />
                          <AvatarFallback className="text-2xl">
                            {"이미지"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {freelancer.author.nickname}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="mt-4">
                  <Table>
                    <TableCaption>
                      ※ 수량 변경 시 작업일과 가격이 자동 계산됩니다.
                    </TableCaption>

                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">기본항목</TableHead>
                        <TableHead className="w-[20%] text-center">
                          수량선택
                        </TableHead>
                        <TableHead className="w-[20%] text-center">
                          작업일
                        </TableHead>
                        <TableHead className="w-[20%] text-right">
                          가격
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">
                            {row.name}
                          </TableCell>

                          {/* 수량 선택: 1부터 올라감 */}
                          <TableCell className="text-center">
                            <QuantityStepper
                              value={row.qty}
                              onChange={(next) => handleQtyChange(row.id, next)}
                              min={1}
                              max={1000}
                            />
                          </TableCell>

                          {/* 작업일 = unitDays * qty */}
                          <TableCell className="text-center">
                            {formatCustomDuration(0, row.days)}
                          </TableCell>

                          {/* 가격 = unitPrice * qty */}
                          <TableCell className="text-right">
                            {row.price.toLocaleString()}원
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* TODO: 결제 방법 */}
          <Card>
            <CardHeader>
              <CardTitle>결제 방법</CardTitle>
            </CardHeader>
            <CardContent>
              <TossPayments
                amount={
                  calcTotals(
                    items.map((item) => ({
                      price: item.unitPrice,
                      qty: item.qty,
                    })),
                  ).total ?? 0
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 금액</span>
                <span className="font-medium">
                  {rows[0]?.price ? rows[0].price.toLocaleString() : 0} 원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground inline-flex items-center gap-1">
                  수수료
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-72 text-xs leading-5">
                        <div className="font-medium mb-1">수수료 정책</div>
                        <div className="mt-2 border-t pt-2">
                          주문 금액의 3% (VAT 포함)
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                <span className="font-medium">
                  {rows[0]?.price ? calcFee(rows[0].price) : 0} 원
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="flex items-baseline text-muted-foreground">
                  <span className="text-[1.15rem] pr-1">총 결제 금액</span>
                  <p className="text-gray-600">(VAT 포함가)</p>
                </span>
                <span className="text-[1.15rem]">
                  {rows[0]?.price
                    ? calcTotals(
                        items.map((item) => ({
                          price: item.unitPrice,
                          qty: item.qty,
                        })),
                      ).total.toLocaleString()
                    : 0}
                  원
                </span>
              </div>
              <TossPaymentsButton
                freelancer={freelancer}
                qty={items[0]?.qty ?? 0}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
