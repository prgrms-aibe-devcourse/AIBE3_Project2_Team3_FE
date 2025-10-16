import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import type {
  PagePayloadReviewDto,
  ProjectReviewListQuery,
  ReviewReqBody,
  RsDataPagePayloadReviewDto,
} from "../types/review.types";

const toQuery = (
  page?: number,
  size?: number,
  sort?: string | string[],
): ProjectReviewListQuery => {
  const sortArr = Array.isArray(sort) ? sort : sort ? [sort] : [];
  return {
    pageable: {
      page: page ?? 0,
      size: size ?? 10,
      sort: sortArr,
    },
  };
};

const createByPostId = async (postId: number, body: ReviewReqBody) =>
  unwrap(
    await client.POST("/api/v1/reviews/{postId}", {
      params: { path: { postId } },
      body,
    }),
  );

const listByProject = async (args: {
  projectId: number;
  page?: number;
  size?: number;
  sort?: string | string[];
}): Promise<PagePayloadReviewDto> => {
  const rs = unwrap<RsDataPagePayloadReviewDto>(
    await client.GET("/api/v1/reviews/project/{projectId}", {
      params: {
        path: { projectId: args.projectId },
        query: toQuery(args.page, args.size, args.sort),
      },
    }),
  );
  return rs.data;
};

export const reviewQueryKeys = createQueryKeys("review", {
  create: (postId: number) => ["create", postId],
  projectListArgs: (
    projectId: number,
    page = 0,
    size = 10,
    sort = "id,ASC",
  ) => [
    "projectList",
    projectId,
    page,
    size,
    Array.isArray(sort) ? sort.join("|") : sort,
  ],
});

export const useCreateReview = (postId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: reviewQueryKeys.create(postId).queryKey,
    mutationFn: (body: ReviewReqBody) => createByPostId(postId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["review"] });
    },
  });
};

export const useProjectReviews = (
  projectId: number,
  opts?: { page?: number; size?: number; sort?: string | string[] },
  enabled = true,
) => {
  const page = opts?.page ?? 0;
  const size = opts?.size ?? 10;
  const sort = opts?.sort ?? "id,ASC";

  return useQuery({
    queryKey: reviewQueryKeys.projectListArgs(projectId, page, size, sort)
      .queryKey,
    queryFn: () => listByProject({ projectId, page, size, sort }),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};
