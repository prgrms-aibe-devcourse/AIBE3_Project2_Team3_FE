import type { ApplicationWithUserDto } from "@/global/types/application.types";

import { components, paths } from "../backend/apiV1/schema";

export type ReviewDto = components["schemas"]["ReviewDto"];
export type ReviewReqBody = components["schemas"]["ReviewReqBody"];
export type RsDataReviewDto = components["schemas"]["RsDataReviewDto"];
export type PagePayloadReviewDto =
  components["schemas"]["PagePayloadReviewDto"];
export type RsDataPagePayloadReviewDto =
  components["schemas"]["RsDataPagePayloadReviewDto"];
export type ProjectReviewListQuery =
  paths["/api/v1/reviews/project/{projectId}"]["get"]["parameters"]["query"];
export type ReviewDialogProps = {
  app: ApplicationWithUserDto;
  trigger?: React.ReactNode;
  onSubmitted?: () => void;
};
