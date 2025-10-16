import { createQueryKeys } from "@lukemorales/query-key-factory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import client from "../backend/client";
import { unwrap } from "../backend/unwrap";
import { PageQuery, Pageable } from "../types/common.types";
import {
  ProjectReviewsParam,
  ReviewReqBody,
  RsDataPagePayloadReviewDto,
  RsDataReviewDto,
} from "../types/review.types";

const listByPost = async (postId: number, q: PageQuery) => {
  const flat = {
    page: q.page ?? 0,
    size: q.size ?? 10,
    sort: Array.isArray(q.sort) ? q.sort : q.sort ? [q.sort] : [],
  };
  const rs = await client.GET("/api/v1/reviews/post/{postId}", {
    params: {
      path: { postId },
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

const updateByPostId = async (reviewId: number, body: ReviewReqBody) =>
  unwrap(
    await client.PUT("/api/v1/reviews/{reviewId}", {
      params: { path: { reviewId } },
      body,
    }),
  );

const getMyReview = async (postId: number) =>
  unwrap<RsDataReviewDto>(
    await client.GET("/api/v1/reviews/my/{postId}", {
      params: { path: { postId } },
    }),
  ).data;

export const reviewQueryKeys = createQueryKeys("review", {
  projectList: (postId: number, q: PageQuery) => [
    "review",
    "postList",
    postId,
    q.page ?? 0,
    q.size ?? 10,
    (q.sort ?? []).join("|"),
  ],
  create: (postId: number) => ["review", "create", postId],
  my: (postId: number) => ["review", "my", postId],
  update: (reviewId: number) => ["review", "update", reviewId],
});

export const usePostReviews = (
  postId: number,
  q: PageQuery,
  enabled = true,
) => {
  return useQuery({
    queryKey: reviewQueryKeys.projectList(postId, {
      page: q.page,
      size: q.size,
      sort: q.sort,
    }).queryKey,
    queryFn: () => listByPost(postId, q),
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
      await qc.invalidateQueries({
        queryKey: reviewQueryKeys.my(postId).queryKey,
      });
    },
  });
};

export const useMyReview = (postId: number, enabled = true) =>
  useQuery({
    queryKey: reviewQueryKeys.my(postId).queryKey,
    queryFn: () => getMyReview(postId),
    staleTime: 5 * 60 * 1000 - 1,
    gcTime: 5 * 60 * 1000 - 1,
    retry: 0,
    enabled,
  });

export const useUpdateReview = (reviewId: number, postId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: reviewQueryKeys.update(reviewId).queryKey,
    mutationFn: (body: ReviewReqBody) => updateByPostId(reviewId, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["review", "projectList"] });
      await qc.invalidateQueries({
        queryKey: reviewQueryKeys.my(postId).queryKey,
      });
    },
  });
};
