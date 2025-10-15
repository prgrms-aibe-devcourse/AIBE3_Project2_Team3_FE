import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useMyOfferListStore } from "../stores/useMyOfferListStore";
import { useReceivedOfferListStore } from "../stores/useReceivedOfferListStore";
import {
  OfferModifyStatusResBody,
  OfferMyListParam,
  OfferReceivedListParam,
} from "../types/offer.types";

const my = async (param: OfferMyListParam) =>
  unwrap(await client.GET("/api/v1/offers/my", { params: { query: param } }));

const received = async (param: OfferReceivedListParam) =>
  unwrap(
    await client.GET("/api/v1/offers/received", {
      params: { query: param },
    }),
  );

const modifyStatus = async (id: number, body: OfferModifyStatusResBody) =>
  unwrap(
    await client.PUT("/api/v1/offers/{id}/status", {
      params: { path: { id } },
      body,
    }),
  );

export const offerQueryKeys = createQueryKeys("offer", {
  my: () => ["my"],
  received: () => ["received"],
  modifyStatus: () => ["modifyStatus"],
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

export const useModifyOfferStatus = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: offerQueryKeys.modifyStatus().queryKey,
    mutationFn: (body: OfferModifyStatusResBody) => modifyStatus(id, body),
    onSuccess: async (res) => {
      await qc.invalidateQueries({
        queryKey: offerQueryKeys.my().queryKey,
      });
      await qc.invalidateQueries({
        queryKey: offerQueryKeys.received().queryKey,
      });
    },
  });
};
