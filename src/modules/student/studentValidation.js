import { z } from "zod";

export const CreateStudentSchema = z.object({
  // User fields
  fullName: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, { error: "Full name must be at least 2 characters" })
    .max(100, { error: "Full name must be 100 characters or fewer" }),

  email: z
    .email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email address",
    })
    .trim()
    .toLowerCase(),

  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(8, { error: "Password must be at least 8 characters" })
    .max(100, { error: "Password must be 100 characters or fewer" })
    .regex(/[A-Za-z]/, { error: "Password must contain at least one letter" })
    .regex(/\d/, { error: "Password must contain at least one number" }),

  // Student fields
  admissionNumber: z
    .string({ error: "Admission number is required" })
    .trim()
    .min(1, { error: "Admission number is required" }),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.string().date("Invalid date format").optional(),
  bloodGroup: z.string().trim().max(10).optional(),
  admissionDate: z.string().date("Invalid date format").optional(),
  previousSchool: z.string().trim().max(150).optional(),

  // Address fields
  streetAddress: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  district: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),

  // Parent/Guardian info
  fatherName: z.string().trim().max(100).optional(),
  fatherPhone: z.string().trim().max(20).optional(),
  motherName: z.string().trim().max(100).optional(),
  motherPhone: z.string().trim().max(20).optional(),
  guardianName: z.string().trim().max(100).optional(),
  guardianPhone: z.string().trim().max(20).optional(),
  relationToStudent: z.string().trim().max(50).optional(),
});

export const UpdateStudentSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.string().datetime().optional(),
  bloodGroup: z.string().trim().max(10).optional(),
  previousSchool: z.string().trim().max(150).optional(),

  streetAddress: z.string().trim().max(255).optional(),
  city: z.string().trim().max(100).optional(),
  district: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),

  fatherName: z.string().trim().max(100).optional(),
  fatherPhone: z.string().trim().max(20).optional(),
  motherName: z.string().trim().max(100).optional(),
  motherPhone: z.string().trim().max(20).optional(),
  guardianName: z.string().trim().max(100).optional(),
  guardianPhone: z.string().trim().max(20).optional(),
  relationToStudent: z.string().trim().max(50).optional(),

  isActive: z.boolean().optional(),
});
export const StudentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  isActive: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
});

export const StudentIdParamSchema = z.object({
  id: z.uuid({
    error: (issue) =>
      issue.input === undefined ? "id is required" : "Invalid UUID format",
  }),
});
