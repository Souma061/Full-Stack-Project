import { z } from "zod";

// File upload validation schemas
export const ImageUploadSchema = z
  .object({
    mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"], {
      errorMap: () => ({
        message: "Only JPEG, PNG, and WebP images are allowed",
      }),
    }),
    size: z.number().max(5 * 1024 * 1024, "Image must be less than 5MB"),
  })
  .strict();

export const VideoUploadSchema = z
  .object({
    mimetype: z.enum(["video/mp4", "video/webm", "video/avi", "video/mov"], {
      errorMap: () => ({
        message: "Only MP4, WebM, AVI, and MOV videos are allowed",
      }),
    }),
    size: z.number().max(100 * 1024 * 1024, "Video must be less than 100MB"),
  })
  .strict();

export const AvatarUploadSchema = z
  .object({
    mimetype: z.enum(["image/jpeg", "image/jpg", "image/png"], {
      errorMap: () => ({
        message: "Only JPEG and PNG images are allowed for avatars",
      }),
    }),
    size: z.number().max(2 * 1024 * 1024, "Avatar must be less than 2MB"),
  })
  .strict();

export const ThumbnailUploadSchema = z
  .object({
    mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"], {
      errorMap: () => ({
        message: "Only JPEG, PNG, and WebP images are allowed for thumbnails",
      }),
    }),
    size: z.number().max(3 * 1024 * 1024, "Thumbnail must be less than 3MB"),
  })
  .strict();
