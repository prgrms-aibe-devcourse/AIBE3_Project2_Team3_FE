import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { Pageable } from "../types/common.types";
import {
  QuestionModifyReqBody,
  QuestionWriteReqBody,
} from "../types/question.types";

const list = async (param: Pageable) =>
  unwrap(
    await client.GET("/api/v1/questions", {
      params: {
        query: {
          pageable: {
            page: param.page,
            size: param.size,
            sort: [param.sort[0] || "createdDate,desc"],
          },
          searchKeyword: "",
        },
      },
    }),
  );

const create = async (body: QuestionWriteReqBody) =>
  unwrap(await client.POST("/api/v1/questions", { body }));

const modify = async (id: number, body: QuestionModifyReqBody) =>
  unwrap(
    await client.PUT("/api/v1/questions/{id}", {
      params: { path: { id } },
      body,
    }),
  );

const remove = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/questions/{id}", {
      params: { path: { id } },
    }),
  );

const myList = async (param: Pageable) =>
  unwrap(
    await client.GET("/api/v1/questions/my", {
      params: {
        query: {
          pageable: {
            page: param.page,
            size: param.size,
            sort: [param.sort[0] || "createdDate,desc"],
          },
        },
      },
    }),
  );

export const questionQueryKeys = createQueryKeys("question", {
  lists: () => ["list"],
  list: (param: Pageable) => ["list", param],
  details: () => ["detail"],
  detail: (id) => ["detail", id],
  create: () => ["create"],
  modify: (id) => ["modify", id],
  remove: (id) => ["remove", id],
  myList: () => ["myList"],
});

export const useListQuestion = (param?: Pageable) => {
  const defaultParam = useMemo(
    () => ({
      page: 0,
      size: 5,
      sort: ["createdDate,desc"],
      ...param,
    }),
    [param],
  );

  return useQuery({
    queryKey: questionQueryKeys.list(defaultParam).queryKey,
    queryFn: () => list(defaultParam),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

export const useCreateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: questionQueryKeys.create().queryKey,
    mutationFn: create,
    onSuccess: (res) => {
      // 모든 질문 목록 캐시 무효화
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "list",
      });
      // 내 질문 목록도 무효화
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "myList",
      });
    },
  });
};

export const useModifyQuestion = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: questionQueryKeys.modify(id).queryKey,
    mutationFn: (body: QuestionModifyReqBody) => modify(id, body),
    onSuccess: (res) => {
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "list",
      });
      qc.invalidateQueries({
        queryKey: questionQueryKeys.myList().queryKey,
      });
      qc.invalidateQueries({
        queryKey: questionQueryKeys.detail(id).queryKey,
      });
    },
  });
};

export const useRemoveQuestion = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: questionQueryKeys.remove(id).queryKey,
    mutationFn: () => remove(id),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "list",
      });
      qc.invalidateQueries({
        queryKey: questionQueryKeys.myList().queryKey,
      });
      qc.invalidateQueries({
        queryKey: questionQueryKeys.detail(id).queryKey,
      });
    },
  });
};

export const useListMyQuestions = (param?: Pageable) => {
  const defaultParam = useMemo(
    () => ({
      page: 0,
      size: 20,
      sort: ["createdDate,desc"],
      ...param,
    }),
    [param],
  );

  return useQuery({
    queryKey: questionQueryKeys.myList().queryKey,
    queryFn: () => myList(defaultParam),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
  });
};

const detail = async (id: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/questions/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`질문을 불러오는데 실패했습니다: ${response.status}`);
  }

  return await response.json();
};

export const useDetailQuestion = (id: number) => {
  return useQuery({
    queryKey: questionQueryKeys.detail(id).queryKey,
    queryFn: () => detail(id),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled: !!id,
  });
};
