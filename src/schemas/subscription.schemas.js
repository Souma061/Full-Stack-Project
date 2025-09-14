import { z } from "zod";
import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const ChannelIdParam = z
  .object({
    channelId: ObjectIdSchema,
  })
  .strict();

export const SubscriberIdParam = z
  .object({
    subscriberId: ObjectIdSchema,
  })
  .strict();

export const SubscriptionListQuery = PaginationQuery;
