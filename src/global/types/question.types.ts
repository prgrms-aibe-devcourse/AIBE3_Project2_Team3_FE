import { components } from "../backend/apiV1/schema";
import { Pageable } from "./common.types";

export type QuestionDto = components["schemas"]["QuestionDto"];
export type QuestionWriteReqBody =
  components["schemas"]["QuestionCreateReqBody"];
export type QuestionModifyReqBody =
  components["schemas"]["QuestionModifyReqBody"];
export type RsDataQuestionDto = components["schemas"]["RsDataQuestionDto"];
export type PagePayloadQuestionDto =
  components["schemas"]["PagePayloadQuestionDto"];

export type AnswerDto = components["schemas"]["AnswerDto"];
export type AnswerWriteReqBody = components["schemas"]["AnswerCreateReqBody"];
export type RsDataAnswerDto = components["schemas"]["RsDataAnswerDto"];

// Questions API를 위한 리스트 파라미터 타입
export type QuestionListParam = Pageable & {
  searchKeyword?: string;
};
