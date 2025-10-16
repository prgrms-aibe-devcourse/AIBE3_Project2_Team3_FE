import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { AnswerWriteReqBody } from "../types/question.types";
import { questionQueryKeys } from "./useQuestionQuery";

const createAnswer = async (questionId: number, body: AnswerWriteReqBody) => {
  const requestBody = {
    questionId,
    content: body.content,
  };

  return unwrap(
    await client.POST("/api/v1/answers", {
      body: requestBody,
    }),
  );
};

const modifyAnswer = async (id: number, body: AnswerWriteReqBody) =>
  unwrap(
    await client.PUT("/api/v1/answers/{id}", {
      params: { path: { id } },
      body: { content: body.content },
    }),
  );

const removeAnswer = async (id: number) =>
  unwrap(
    await client.DELETE("/api/v1/answers/{id}", {
      params: { path: { id } },
    }),
  );

export const answerQueryKeys = createQueryKeys("answer", {
  create: () => ["create"],
  modify: (id) => ["modify", id],
  remove: (id) => ["remove", id],
});

export const useCreateAnswer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: answerQueryKeys.create().queryKey,
    mutationFn: ({
      questionId,
      body,
    }: {
      questionId: number;
      body: AnswerWriteReqBody;
    }) => createAnswer(questionId, body),
    onSuccess: (res, variables) => {
      // 질문 목록 캐시 무효화
      qc.invalidateQueries({
        queryKey: questionQueryKeys.lists().queryKey,
      });
      // 해당 질문 상세 캐시 무효화 (답변 등록 후 즉시 반영)
      qc.invalidateQueries({
        queryKey: questionQueryKeys.detail(variables.questionId).queryKey,
      });
    },
  });
};

export const useModifyAnswer = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: answerQueryKeys.modify(id).queryKey,
    mutationFn: (body: AnswerWriteReqBody) => modifyAnswer(id, body),
    onSuccess: (res) => {
      // 질문 목록 캐시 무효화
      qc.invalidateQueries({
        queryKey: questionQueryKeys.lists().queryKey,
      });
      // 모든 질문 상세 캐시 무효화 (답변 수정 후 즉시 반영)
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "detail",
      });
    },
  });
};

export const useRemoveAnswer = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: answerQueryKeys.remove(id).queryKey,
    mutationFn: () => removeAnswer(id),
    onSuccess: () => {
      // 질문 목록 캐시 무효화
      qc.invalidateQueries({
        queryKey: questionQueryKeys.lists().queryKey,
      });
      // 모든 질문 상세 캐시 무효화 (답변 삭제 후 즉시 반영)
      qc.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "question" && query.queryKey[1] === "detail",
      });
    },
  });
};
