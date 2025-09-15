import { z } from "zod";

import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const VideoIdParam = z
  .object({
    videoId: ObjectIdSchema,
  })
  .strict();

export const CommentIdParam = z
  .object({
    commentId: ObjectIdSchema,
  })
  .strict();

export const CommentListQuery = PaginationQuery;
export const CommentBody = z
  .object({
    content: z.string().trim().min(1).max(1000),
  })
  .strict();
