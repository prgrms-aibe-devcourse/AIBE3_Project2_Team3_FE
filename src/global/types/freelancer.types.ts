import { components } from "../backend/apiV1/schema";
import { Pageable } from "./common.types";

export type FreelancerDto = components["schemas"]["FreelancerDto"];
export type FreelancerWriteReqBody =
  components["schemas"]["FreelancerWriteReqBody"];
export type FreelancerModifyReqBody =
  components["schemas"]["FreelancerModifyReqBody"];
export type RsDataFreelancerDto = components["schemas"]["RsDataFreelancerDto"];
export type PagePayloadFreelancerDto =
  components["schemas"]["PagePayloadFreelancerDto"];

export type FreelancerListParam = Pageable & {
  searchKeyword: string;
};
