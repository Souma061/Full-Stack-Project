import { z } from "zod";

// Auth-specific schemas for JWT tokens and refresh tokens
export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  })
  .strict();

export const TokenResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
  })
  .strict();

// Email verification and password reset schemas
export const EmailVerificationSchema = z
  .object({
    token: z.string().min(1, "Verification token is required"),
  })
  .strict();

export const PasswordResetRequestSchema = z
  .object({
    email: z.string().email("Invalid email address"),
  })
  .strict();

export const PasswordResetSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .strict();
