import { createQueryKeys } from "@lukemorales/query-key-factory";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { useSkillListStore } from "../stores/useSkillListStore";
import { SkillCreateReqBody, SkillListParam } from "../types/skill.types";

const list = async (param: SkillListParam) =>
  unwrap(
    await client.GET("/api/v1/skills", {
      params: { query: param },
    }),
  );

const create = async (body: SkillCreateReqBody) =>
  unwrap(await client.POST("/api/v1/admin/skills", { body }));

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/admin/skills/{id}", {
      params: { path: { id } },
    }),
  );

export const SkillQueryKeys = createQueryKeys("skill", {
  lists: () => ["list"], // 루트 키(무효화용)
  list: (param: SkillListParam) => ["list", param], // 실제 쿼리키
  create: () => ["create"],
  remove: (id: number) => ["remove", id],
});

export const useListSkill = () => {
  const { size, sort, search } = useSkillListStore((s) => s);
  const param = useMemo(
    () => ({ size, sort, searchKeyword: search }),
    [size, sort, search],
  );

  return useInfiniteQuery({
    queryKey: SkillQueryKeys.list(param).queryKey,
    queryFn: ({ pageParam }) => list({ ...param, page: pageParam }),
    getNextPageParam: (res) => (res.page.last ? null : res.page.page + 1),
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: SkillQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: () => {
      // 모든 skill list 쿼리 무효화 (검색/정렬 조합 여러 개일 수 있으니 루트 무효화)
      qc.invalidateQueries({ queryKey: SkillQueryKeys.lists().queryKey });
    },
  });
};

export const useRemoveSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["skill", "remove"],
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SkillQueryKeys.lists().queryKey });
    },
  });
};
