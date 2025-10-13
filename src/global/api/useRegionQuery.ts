import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { RegionCreateReqBody } from "../types/region.types";

const list = async () => unwrap(await client.GET("/api/v1/regions"));
const create = async (body: RegionCreateReqBody) =>
  unwrap(await client.POST("/api/v1/admin/regions", { body }));

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/admin/regions/{id}", {
      params: { path: { id } },
    }),
  );

export const RegionQueryKeys = createQueryKeys("region", {
  list: () => ["list"],
  create: () => ["create"],
  remove: () => ["remove"],
});

export const useListRegion = () => {
  return useQuery({
    queryKey: RegionQueryKeys.list().queryKey,
    queryFn: list,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: RegionQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: RegionQueryKeys.list().queryKey });
    },
  });
};

export const useRemoveRegion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: RegionQueryKeys.remove().queryKey,
    mutationFn: (id: number) => remove(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: RegionQueryKeys.list().queryKey });
    },
  });
};
