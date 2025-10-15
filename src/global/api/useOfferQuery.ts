import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useMyOfferListStore } from "../stores/useMyOfferListStore";
import { useReceivedOfferListStore } from "../stores/useReceivedOfferListStore";
import { OfferMyListParam, OfferReceivedListParam } from "../types/offer.types";

const my = async (param: OfferMyListParam) =>
  unwrap(await client.GET("/api/v1/offers/my", { params: { query: param } }));

const received = async (param: OfferReceivedListParam) =>
  unwrap(
    await client.GET("/api/v1/offers/received", {
      params: { query: param },
    }),
  );

export const offerQueryKeys = createQueryKeys("offer", {
  my: () => ["my"],
  received: () => ["received"],
});

export const useListMyOffer = (enabled = true) => {
  const { page, size, sort, status } = useMyOfferListStore((state) => state);
  const param = useMemo(
    () => ({ page, size, sort, status }),
    [page, size, sort, status],
  );
  return useQuery({
    queryKey: offerQueryKeys.my().queryKey,
    queryFn: () => my(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};

export const useListReceivedOffer = (enabled = true) => {
  const { page, size, sort, status } = useReceivedOfferListStore(
    (state) => state,
  );
  const param = useMemo(
    () => ({ page, size, sort, status }),
    [page, size, sort, status],
  );
  return useQuery({
    queryKey: offerQueryKeys.received().queryKey,
    queryFn: () => received(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};
