import { z } from "zod";

export const RegisterUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email is too long")
        .toLowerCase(),

    password: z
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password cannot exceed 100 characters")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .regex(/^\S*$/, "Password must not contain spaces"),
});

export const LoginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email address")
        .max(255, "Email is too long")
        .toLowerCase(),

    password: z
        .string()
        .trim()
});