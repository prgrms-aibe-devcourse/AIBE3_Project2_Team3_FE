import { components, paths } from "../backend/apiV1/schema";

export type OfferMyListParam =
  paths["/api/v1/offers/my"]["get"]["parameters"]["query"];
export type OfferReceivedListParam =
  paths["/api/v1/offers/received"]["get"]["parameters"]["query"];
export type OfferStatus = NonNullable<OfferMyListParam>["status"];
export type OfferWithUserDto = components["schemas"]["OfferWithUserDto"];
export type OfferModifyStatusResBody =
  components["schemas"]["OfferModifyStatusResBody"];
