import { components } from "../backend/apiV1/schema";
import { PageQuery } from "./common.types";

export type SkillListParam = PageQuery & {
  searchKeyword?: string;
};
export type SkillDto = components["schemas"]["SkillDto"];
export type SkillCreateReqBody = components["schemas"]["SkillCreateReqBody"];
export type PagePayloadSkillDto = components["schemas"]["PagePayloadSkillDto"];
