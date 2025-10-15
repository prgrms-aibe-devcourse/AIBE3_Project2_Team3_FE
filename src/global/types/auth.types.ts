import { components, paths } from "../backend/apiV1/schema";

type ModifyReqBody = NonNullable<paths["/api/v1/users"]["put"]["requestBody"]>;
export type ModifyUserReqBody = ModifyReqBody["content"]["multipart/form-data"];
export type RsDataUserDto = components["schemas"]["RsDataUserDto"];
export type UserDto = components["schemas"]["UserDto"];
export type UserLoginReqBody = components["schemas"]["UserLoginReqBody"];
export type UserJoinReqBody = components["schemas"]["UserJoinReqBody"];
export type UserModifyReqBody = components["schemas"]["UserModifyReqBody"];
export type UserFindPasswordReqBody =
  components["schemas"]["UserFindPasswordReqBody"];
export type UserPasswordUpdateReqBody =
  components["schemas"]["UserPasswordUpdateReqBody"];
export type UserDeleteReqBody = components["schemas"]["UserDeleteReqBody"];
