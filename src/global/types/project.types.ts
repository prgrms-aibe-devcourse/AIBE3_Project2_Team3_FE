import { components } from "../backend/apiV1/schema";
import { Pageable } from "./common.types";

export type ProjectDto = components["schemas"]["ProjectDto"];
export type ProjectWriteReqBody = components["schemas"]["ProjectWriteReqBody"];
export type ProjectModifyReqBody =
  components["schemas"]["ProjectModifyReqBody"];
export type RsDataProjectDto = components["schemas"]["RsDataProjectDto"];
export type PagePayloadProjectDto =
  components["schemas"]["PagePayloadProjectDto"];

export type ProjectListParam = Pageable & {
  regionIds: number[];
  categoryIds: number[];
  skillIds: number[];
  minSalary: number;
  maxSalary: number;
  keyword: string;
};

export type HirerType = "individual" | "corporate"; // 고용인 유형
export type EmploymentType = "onsite" | "outsourcing"; // 고용 유형
