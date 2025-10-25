// Central export file for all schemas
export * from "./common.schemas.js";
export * from "./user.schemas.js";

// Video schemas (main source for VideoIdParam)
export * from "./video.schemas.js";

// Other schema files (excluding conflicting exports)
export * from "./auth.schemas.js";
export {
  CommentBody,
  CommentIdParam,
  CommentListQuery,
} from "./comment.schemas.js";
export * from "./dashboard.schemas.js";
export * from "./like.schemas.js";
export {
  PlaylistCreateBody,
  PlaylistIdParam,
  PlaylistListQuery,
  PlaylistUpdateBody,
  PlaylistVideoIdParam,
  UserIdParam,
} from "./playlist.schemas.js";
export * from "./subscription.schemas.js";
export * from "./tweet.schemas.js";
export * from "./upload.schemas.js";
