import { z } from "zod";

export const CreateSchoolSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "School name must be at least 2 characters")
        .max(100, "School name cannot exceed 100 characters"),

    isActive: z.boolean().optional().default(true)
});

export const UpdateSchoolSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "School name must be at least 2 characters")
        .max(100, "School name cannot exceed 100 characters")
        .optional(),

    slug: z
        .string()
        .trim()
        .min(2, "Slug must be at least 2 characters")
        .max(100, "Slug cannot exceed 100 characters")
        .optional(),

    isActive: z.boolean().optional()
});
