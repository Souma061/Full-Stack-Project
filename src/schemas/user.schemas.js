import { z } from "zod";

// Reusable primitive schemas

export const ObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(255);

export const UsernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .max(30, "Username must be at most 30 characters long")
  .toLowerCase()
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const FullNameSchema = z
  .string()
  .trim()
  .min(1, "Full name is required")
  .max(100, "Full name must be at most 100 characters long");

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(100, "Password must be at most 100 characters long");

// params

export const UserIdParamSchema = z
  .object({
    userId: ObjectIdSchema,
  })
  .strict();
export const UsernameParamSchema = z
  .object({
    username: UsernameSchema,
  })
  .strict();

// request bodies

export const UserRegisterSchema = z
  .object({
    email: EmailSchema,
    username: UsernameSchema,
    fullName: FullNameSchema,
    password: PasswordSchema,
  })
  .strict();

export const UserLoginSchema = z
  .object({
    email: EmailSchema.optional(),
    username: UsernameSchema.optional(),
    password: PasswordSchema,
  })
  .strict()
  .refine((v) => !!v.email || !!v.username, {
    message: "Either email or username is required",
    path: ["email"],
  });

export const UserAccountUpdateSchema = z
  .object({
    fullName: FullNameSchema,
    username: UsernameSchema,
    email: EmailSchema,
  })
  .strict();

export const UserPartialUpdateSchema = z
  .object({
    fullName: FullNameSchema.optional(),
    username: UsernameSchema.optional(),
    email: EmailSchema.optional(),
    password: PasswordSchema.optional(),
    avatarUrl: z.string().url().optional(),
    coverImageUrl: z.string().url().optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided for update",
  });

export const ChangePasswordSchema = z
  .object({
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema,
  })
  .strict()
  .refine((v) => v.oldPassword !== v.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });
