import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useProjectListStore } from "../stores/useProjectListStore";
import {
  ProjectListParam,
  ProjectModifyReqBody,
  ProjectWriteReqBody,
} from "../types/project.types";

const list = async (param: ProjectListParam) =>
  unwrap(
    await client.GET("/api/v1/projects", {
      params: { query: param },
    }),
  );

const detail = async (id: number) =>
  unwrap(
    await client.GET("/api/v1/projects/{id}", { params: { path: { id } } }),
  );

const create = async (body: ProjectWriteReqBody) =>
  unwrap(await client.POST("/api/v1/projects", { body }));

const modify = async (id: number, body: ProjectModifyReqBody) =>
  unwrap(
    await client.PUT("/api/v1/projects/{id}", {
      params: { path: { id } },
      body,
    }),
  );

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/projects/{id}", {
      params: { path: { id } },
    }),
  );

export const projectQueryKeys = createQueryKeys("project", {
  lists: () => ["list"],
  list: (param: ProjectListParam) => ["list", param],
  details: () => ["detail"],
  detail: (id) => ["detail", id],
  create: () => ["create"],
  modify: (id) => ["modify", id],
  remove: (id) => ["remove", id],
});

export const useListProject = () => {
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
  } = useProjectListStore((state) => state);
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
    queryKey: projectQueryKeys.list(param).queryKey,
    queryFn: () => list(param),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useDetailProject = (id: number) => {
  return useQuery({
    queryKey: projectQueryKeys.detail(id).queryKey,
    queryFn: () => detail(id),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: projectQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: (res) => {
      qc.setQueryData(projectQueryKeys.detail(res.data.id).queryKey, res.data);
    },
  });
};

export const useModifyProject = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: projectQueryKeys.modify(id).queryKey,
    mutationFn: (body: ProjectModifyReqBody) => modify(id, body),
    onSuccess: (res) => {
      qc.setQueryData(projectQueryKeys.detail(id).queryKey, res.data);
    },
  });
};

export const useRemoveProject = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: projectQueryKeys.remove(id).queryKey,
    mutationFn: () => remove(id),
    onSuccess: () => {
      qc.setQueryData(projectQueryKeys.detail(id).queryKey, null);
    },
  });
};
