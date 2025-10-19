import { components } from "../backend/apiV1/schema";

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
