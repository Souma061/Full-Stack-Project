import { z } from "zod";
import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const TweetIdParam = z.object({ tweetId: ObjectIdSchema }).strict();
export const TweetUserIdParam = z.object({ userId: ObjectIdSchema }).strict();

export const TweetCreateBody = z
  .object({
    content: z.string().trim().min(1).max(280),
  })
  .strict();

export const TweetUpdateBody = TweetCreateBody.partial().refine(
  (v) => Object.keys(v).length > 0,
  {
    message: "At least one field must be provided for update",
  }
);

export const TweetListQuery = PaginationQuery;
