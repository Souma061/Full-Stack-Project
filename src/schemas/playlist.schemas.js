import { z } from "zod";
import { ObjectIdSchema, PaginationQuery } from "./common.schemas.js";

export const PlaylistIdParam = z.object({
  playlistId: ObjectIdSchema,
}).strict()

export const VideoIdParam = z.object({
  videoId: ObjectIdSchema,
}).strict()

export const UserIdParam = z.object({
  userId: ObjectIdSchema,
}).strict()
export const PlaylistCreateBody = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
}).strict();

export const PlaylistUpdateBody = PlaylistCreateBody
  .partial()
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided for update",
  })
  .strict();

export const PlaylistListQuery = PaginationQuery;

