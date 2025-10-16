import { components, paths } from "../backend/apiV1/schema";

export type ReviewDto = components["schemas"]["ReviewDto"];
export type ReviewReqBody = components["schemas"]["ReviewReqBody"];
export type PagePayloadReviewDto =
  components["schemas"]["PagePayloadReviewDto"];
export type RsDataPagePayloadReviewDto =
  components["schemas"]["RsDataPagePayloadReviewDto"];
export type RsDataReviewDto = components["schemas"]["RsDataReviewDto"];
export type ProjectReviewsParam =
  paths["/api/v1/reviews/project/{projectId}"]["get"]["parameters"]["query"];
