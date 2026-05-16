import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const reviewSchema = z.object({
  code: z
    .string()
    .min(10, "Code must be at least 10 characters")
    .max(20000, "Code exceeds maximum length"),
  language: z.string().min(1, "Please select a language"),
})

export const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(4000),
  chatId: z.string().optional(),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ChatInput = z.infer<typeof chatSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
