import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { Pageable } from "../types/common.types";
import {
  QuestionListParam,
  QuestionModifyReqBody,
  QuestionWriteReqBody,
} from "../types/question.types";

const list = async (param: QuestionListParam) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const searchParams = new URLSearchParams();

  searchParams.append("pageable.page", param.page.toString());
  searchParams.append("pageable.size", param.size.toString());

  const sortArray = param.sort.length > 0 ? param.sort : ["createdDate,desc"];
  sortArray.forEach((sortItem) => {
    searchParams.append("pageable.sort", sortItem);
  });

  searchParams.append("searchKeyword", param.searchKeyword || "");

  const url = `${baseUrl}/api/v1/questions?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.resultCode === "S-1") {
    return result.data;
  } else if (result.content && result.page) {
    return result;
  } else if (result.resultCode) {
    throw new Error(
      result.message || `API call failed with code: ${result.resultCode}`,
    );
  } else {
    return result;
  }
};

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

const myList = async (param: Pageable) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const searchParams = new URLSearchParams();

  searchParams.append("pageable.page", param.page.toString());
  searchParams.append("pageable.size", param.size.toString());

  const sortArray = param.sort.length > 0 ? param.sort : ["createdDate,desc"];
  sortArray.forEach((sortItem) => {
    searchParams.append("pageable.sort", sortItem);
  });

  const url = `${baseUrl}/api/v1/questions/my?${searchParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (result.resultCode === "S-1") {
    return result.data;
  } else if (result.content && result.page) {
    return result;
  } else if (result.resultCode) {
    throw new Error(
      result.message || `API call failed with code: ${result.resultCode}`,
    );
  } else {
    return result;
  }
};

export const questionQueryKeys = createQueryKeys("question", {
  lists: () => ["list"],
  list: (param: QuestionListParam) => ["list", param],
  details: () => ["detail"],
  detail: (id) => ["detail", id],
  create: () => ["create"],
  modify: (id) => ["modify", id],
  remove: (id) => ["remove", id],
  myList: () => ["myList"],
});

export const useListQuestion = (param?: Partial<QuestionListParam>) => {
  const defaultParam = useMemo(
    (): QuestionListParam => ({
      page: 0,
      size: 5,
      sort: ["createdDate,desc"],
      searchKeyword: "",
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

const detail = async (id: number) =>
  unwrap(
    await client.GET("/api/v1/questions/{id}", { params: { path: { id } } }),
  );

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
