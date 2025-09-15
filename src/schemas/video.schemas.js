import { z } from "zod";
import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const VideoIdParam = z.object({ videoId: ObjectIdSchema }).strict();

export const VideoListQuery = PaginationQuery.extend({
  sortBy: z
    .enum(["createdAt", "updatedAt", "views", "title", "duration"])
    .optional(),
  sortType: z.enum(["asc", "desc"]).optional(),
  userId: ObjectIdSchema.optional(),
  query: z.string().trim().min(1).max(100).optional(),
}).strict();

export const VideoCreateBody = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000),
    privacy: z
      .enum(["public", "private", "unlisted"])
      .default("public")
      .optional(),
  })
  .strict();

export const VideoUpdateBody = VideoCreateBody.partial().refine(
  (v) => Object.keys(v).length > 0,
  {
    message: "At least one field must be provided for update",
  }
);
