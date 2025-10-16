import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { PageQuery, Pageable } from "../types/common.types";
import {
  ProjectReviewsParam,
  ReviewReqBody,
  RsDataPagePayloadReviewDto,
} from "../types/review.types";

const listByProject = async (projectId: number, q: PageQuery) => {
  const flat = {
    page: q.page ?? 0,
    size: q.size ?? 10,
    sort: Array.isArray(q.sort) ? q.sort : q.sort ? [q.sort] : [],
  };
  const rs = await client.GET("/api/v1/reviews/project/{projectId}", {
    params: {
      path: { projectId },
      query: flat as unknown as ProjectReviewsParam,
    },
  });

  return unwrap<RsDataPagePayloadReviewDto>(rs).data;
};

const createByPostId = async (postId: number, body: ReviewReqBody) =>
  unwrap(
    await client.POST("/api/v1/reviews/{postId}", {
      params: { path: { postId } },
      body,
    }),
  );

export const reviewQueryKeys = createQueryKeys("review", {
  projectList: (projectId: number, q: PageQuery) => [
    "review",
    "projectList",
    projectId,
    q.page ?? 0,
    q.size ?? 10,
    (q.sort ?? []).join("|"),
  ],
  create: (postId: number) => ["review", "create", postId],
});

export const useProjectReviews = (
  projectId: number,
  q: PageQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: reviewQueryKeys.projectList(projectId, {
      page: q.page,
      size: q.size,
      sort: q.sort,
    }).queryKey,
    queryFn: () => listByProject(projectId, q),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });
};

export const useCreateReview = (postId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: reviewQueryKeys.create(postId).queryKey,
    mutationFn: (body: ReviewReqBody) => createByPostId(postId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["review", "projectList"] });
    },
  });
};
