import { components, paths } from "../backend/apiV1/schema";

type ReqBody = NonNullable<
  paths["/api/v1/applications"]["post"]["requestBody"]
>;
export type CreateAppReq = ReqBody["content"]["multipart/form-data"];
export type AppMyListParam =
  paths["/api/v1/applications/my"]["get"]["parameters"]["query"];
export type AppReceivedListParam =
  paths["/api/v1/applications/received"]["get"]["parameters"]["query"];
export type ApplicationStatus = NonNullable<AppMyListParam>["status"];
export type ApplicationDto = components["schemas"]["ApplicationDto"];
