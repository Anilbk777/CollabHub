import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const CreateAcademicSessionSchema = z.object({
    academicYear: z
        .string({ required_error: "academicYear is required" })
        .trim()
        .min(4, "Academic year format is required (e.g. 2025-2026)")
        .max(20),

    startDate: z
        .string({ required_error: "startDate is required" })
        .datetime("Invalid ISO date format for startDate"),

    endDate: z
        .string({ required_error: "endDate is required" })
        .datetime("Invalid ISO date format for endDate"),

    isCurrent: z.coerce.boolean().optional().default(false)
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be before or equal to end date",
    path: ["endDate"]
});

export const UpdateAcademicSessionSchema = z.object({
    academicYear: z.string().trim().min(4).max(20).optional(),
    startDate: z.string().datetime("Invalid ISO date format for startDate").optional(),
    endDate: z.string().datetime("Invalid ISO date format for endDate").optional(),
    isCurrent: z.boolean().optional()
});

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().positive().optional().default(1),
    limit: z.coerce.number().positive().optional().default(10)
});
