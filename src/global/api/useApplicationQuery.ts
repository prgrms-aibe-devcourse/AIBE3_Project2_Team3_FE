import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useMyAppListStore } from "../stores/useMyAppListStore";
import { useReceivedAppListStore } from "../stores/useReceivedAppListStore";
import {
  AppMyListParam,
  AppReceivedListParam,
  CreateAppReq,
} from "../types/application.types";

const create = async (formData: FormData) =>
  unwrap(
    await client.POST("/api/v1/applications", {
      body: formData as unknown as CreateAppReq,
      // openapi-fetch will set content-type for FormData automatically
    }),
  );
const my = async (param: AppMyListParam) =>
  unwrap(
    await client.GET("/api/v1/applications/my", { params: { query: param } }),
  );

const received = async (param: AppReceivedListParam) =>
  unwrap(
    await client.GET("/api/v1/applications/received", {
      params: { query: param },
    }),
  );

export const applicationQueryKeys = createQueryKeys("application", {
  create: () => ["create"],
  my: () => ["my"],
  received: () => ["received"],
});

export const useCreateApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: applicationQueryKeys.create().queryKey,
    mutationFn: (fd: FormData) => create(fd),
    onSuccess: (res) => {
      qc.invalidateQueries();
    },
  });
};

export const useListMyApp = (enabled = true) => {
  const { page, size, sort, status } = useMyAppListStore((state) => state);
  const param = useMemo(
    () => ({ page, size, sort, status }),
    [page, size, sort, status],
  );
  return useQuery({
    queryKey: applicationQueryKeys.my().queryKey,
    queryFn: () => my(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};

export const useListReceivedApp = (enabled = true) => {
  const { page, size, sort, status } = useReceivedAppListStore(
    (state) => state,
  );
  const param = useMemo(
    () => ({ page, size, sort, status }),
    [page, size, sort, status],
  );
  return useQuery({
    queryKey: applicationQueryKeys.received().queryKey,
    queryFn: () => received(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};

export default useCreateApplication;
