import { paths } from "../backend/apiV1/schema";

type ReqBody = NonNullable<
  paths["/api/v1/applications"]["post"]["requestBody"]
>;
export type CreateAppReq = ReqBody["content"]["multipart/form-data"];
