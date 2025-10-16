import { components, paths } from "../backend/apiV1/schema";
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
  regionIds: number[];
  categoryIds: number[];
  skillIds: number[];
  minSalary: number;
  maxSalary: number;
  keyword: string;
};

type CreateReqBody = NonNullable<
  paths["/api/v1/freelancers"]["post"]["requestBody"]
>;
export type CreateFreelancerReqBody =
  CreateReqBody["content"]["multipart/form-data"];
type ModifyReqBody = NonNullable<
  paths["/api/v1/freelancers/{id}"]["put"]["requestBody"]
>;
export type ModifyFreelancerReqBody =
  ModifyReqBody["content"]["multipart/form-data"];
