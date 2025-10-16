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
  ApplicationModifyStatusResBody,
  CreateAppReqBody,
  ModifyAppReqBody,
} from "../types/application.types";

const create = async (formData: FormData) =>
  unwrap(
    await client.POST("/api/v1/applications", {
      body: formData as unknown as CreateAppReqBody,
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
const detail = async (id: number) =>
  unwrap(
    await client.GET("/api/v1/applications/{id}", { params: { path: { id } } }),
  );

const modify = async (param: { id: number; formData: FormData }) =>
  unwrap(
    await client.PUT("/api/v1/applications/{id}", {
      params: { path: { id: param.id } },
      body: param.formData as unknown as ModifyAppReqBody,
    }),
  );

const modifyStatus = async (id: number, body: ApplicationModifyStatusResBody) =>
  unwrap(
    await client.PUT("/api/v1/applications/{id}/status", {
      params: { path: { id } },
      body,
    }),
  );

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/applications/{id}", {
      params: { path: { id } },
    }),
  );

export const applicationQueryKeys = createQueryKeys("application", {
  create: () => ["create"],
  my: () => ["my"],
  received: () => ["received"],
  detail: (id) => ["detail", id],
  modify: () => ["modify"],
  modifyStatus: () => ["modifyStatus"],
  remove: () => ["remove"],
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

export const useDetailApplication = (id: number) => {
  return useQuery({
    queryKey: applicationQueryKeys.detail(id).queryKey,
    queryFn: () => detail(id),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useModifyApplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: applicationQueryKeys.modify().queryKey,
    mutationFn: (param: { id: number; formData: FormData }) => modify(param),
    onSuccess: async (res) => {
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.my().queryKey,
      });
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.received().queryKey,
      });
    },
  });
};

export const useModifyAppStatus = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: applicationQueryKeys.modifyStatus().queryKey,
    mutationFn: (body: ApplicationModifyStatusResBody) =>
      modifyStatus(id, body),
    onSuccess: async (res) => {
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.my().queryKey,
      });
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.received().queryKey,
      });
    },
  });
};

export const useRemoveApp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: applicationQueryKeys.remove().queryKey,
    mutationFn: (id: number) => remove(id),
    onSuccess: async (res) => {
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.my().queryKey,
      });
      await qc.invalidateQueries({
        queryKey: applicationQueryKeys.received().queryKey,
      });
    },
  });
};

export default useCreateApplication;
