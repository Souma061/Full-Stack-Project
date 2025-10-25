import { z } from "zod";
import { PaginationQuery } from "./common.schemas.js";

export const DashboardVideosQuery = PaginationQuery.extend({
  sortBy: z.enum(["createdAt", "views", "likesCount", "title"]).optional(),
  sortType: z.enum(["asc", "desc"]).optional(),
}).strict();
