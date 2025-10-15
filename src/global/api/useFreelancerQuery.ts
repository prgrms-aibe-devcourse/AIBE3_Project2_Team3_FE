import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useFreelancerListStore } from "../stores/useFreelancerListStore";
import { useMyFreelancerListStore } from "../stores/useMyFreelancerListStore";
import { Pageable } from "../types/common.types";
import {
  CreateFreelancerReqBody,
  FreelancerListParam,
  ModifyFreelancerReqBody,
} from "../types/freelancer.types";

const list = async (param: FreelancerListParam) =>
  unwrap(
    await client.GET("/api/v1/freelancers", {
      params: { query: param },
    }),
  );

const detail = async (id: number) =>
  unwrap(
    await client.GET("/api/v1/freelancers/{id}", { params: { path: { id } } }),
  );

const create = async (formData: FormData) =>
  unwrap(
    await client.POST("/api/v1/freelancers", {
      body: formData as unknown as CreateFreelancerReqBody,
    }),
  );

const modify = async (id: number, formData: FormData) =>
  unwrap(
    await client.PUT("/api/v1/freelancers/{id}", {
      params: { path: { id } },
      body: formData as unknown as ModifyFreelancerReqBody,
    }),
  );

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/freelancers/{id}", {
      params: { path: { id } },
    }),
  );

const myList = async (param: Pageable) =>
  unwrap(
    await client.GET("/api/v1/freelancers/my", {
      params: { query: param },
    }),
  );

export const freelancerQueryKeys = createQueryKeys("freelancer", {
  lists: () => ["list"],
  list: (param: FreelancerListParam) => ["list", param],
  details: () => ["detail"],
  detail: (id) => ["detail", id],
  create: () => ["create"],
  modify: (id) => ["modify", id],
  remove: (id) => ["remove", id],
  myList: () => ["myList"],
});

export const useListFreelancer = () => {
  const {
    page,
    size,
    sort,
    keyword,
    categoryIds,
    regionIds,
    skillIds,
    minSalary,
    maxSalary,
  } = useFreelancerListStore((state) => state);
  const param = useMemo(
    () => ({
      page,
      size,
      sort,
      keyword,
      categoryIds,
      regionIds,
      skillIds,
      minSalary,
      maxSalary,
    }),
    [
      page,
      size,
      sort,
      keyword,
      categoryIds,
      regionIds,
      skillIds,
      minSalary,
      maxSalary,
    ],
  );
  return useQuery({
    queryKey: freelancerQueryKeys.list(param).queryKey,
    queryFn: () => list(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useDetailFreelancer = (id: number) => {
  return useQuery({
    queryKey: freelancerQueryKeys.detail(id).queryKey,
    queryFn: () => detail(id),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateFreelancer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: freelancerQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: (res) => {
      qc.setQueryData(
        freelancerQueryKeys.detail(res.data.id).queryKey,
        res.data,
      );
    },
  });
};

export const useModifyFreelancer = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: freelancerQueryKeys.modify(id).queryKey,
    mutationFn: (formData: FormData) => modify(id, formData),
    onSuccess: (res) => {
      qc.setQueryData(freelancerQueryKeys.detail(id).queryKey, res.data);
    },
  });
};

export const useRemoveFreelancer = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: freelancerQueryKeys.remove(id).queryKey,
    mutationFn: () => remove(id),
    onSuccess: () => {
      qc.setQueryData(freelancerQueryKeys.detail(id).queryKey, null);
    },
  });
};

export const useListMyFreelancers = () => {
  const { page, size, sort } = useMyFreelancerListStore((state) => state);
  const param = useMemo(() => ({ page, size, sort }), [page, size, sort]);
  return useQuery({
    queryKey: freelancerQueryKeys.myList().queryKey,
    queryFn: () => myList(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};
