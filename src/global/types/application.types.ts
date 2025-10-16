import { components, paths } from "../backend/apiV1/schema";

type CreateReqBody = NonNullable<
  paths["/api/v1/applications"]["post"]["requestBody"]
>;
type ModifyReqBody = NonNullable<
  paths["/api/v1/applications/{id}"]["put"]["requestBody"]
>;
export type ApplicationDto = components["schemas"]["ApplicationDto"];
export type CreateAppReqBody = CreateReqBody["content"]["multipart/form-data"];
export type ModifyAppReqBody = ModifyReqBody["content"]["multipart/form-data"];
export type AppMyListParam =
  paths["/api/v1/applications/my"]["get"]["parameters"]["query"];
export type AppReceivedListParam =
  paths["/api/v1/applications/received"]["get"]["parameters"]["query"];
export type ApplicationStatus = NonNullable<AppMyListParam>["status"];
export type ApplicationWithUserDto =
  components["schemas"]["ApplicationWithUserDto"];
export type ApplicationModifyStatusResBody =
  components["schemas"]["ApplicationModifyStatusResBody"];

export type ApplicationModifyStatusParam = {
  id: number;
  body: ApplicationModifyStatusResBody;
};
