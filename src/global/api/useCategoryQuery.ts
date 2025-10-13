import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { CategoryCreateReqBody } from "../types/category.types";

const list = async () => unwrap(await client.GET("/api/v1/categories"));
const create = async (body: CategoryCreateReqBody) =>
  unwrap(await client.POST("/api/v1/admin/categories", { body }));

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/admin/categories/{id}", {
      params: { path: { id } },
    }),
  );

export const CategoryQueryKeys = createQueryKeys("category", {
  list: () => ["list"],
  create: () => ["create"],
  remove: () => ["remove"],
});

export const useListCategory = () => {
  return useQuery({
    queryKey: CategoryQueryKeys.list().queryKey,
    queryFn: list,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: CategoryQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: CategoryQueryKeys.list().queryKey });
    },
  });
};

export const useRemoveCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: CategoryQueryKeys.remove().queryKey,
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CategoryQueryKeys.list().queryKey });
    },
  });
};
