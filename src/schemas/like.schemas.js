import { z } from "zod";
import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const LikeVideoIdParam = z
  .object({
    videoId: ObjectIdSchema,
  })
  .strict();

export const LikeCommentIdParam = z
  .object({
    commentId: ObjectIdSchema,
  })
  .strict();

export const LikeTweetIdParam = z
  .object({
    tweetId: ObjectIdSchema,
  })
  .strict();

export const LikedVideosQuery = PaginationQuery;
