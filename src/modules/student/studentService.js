import AppError from "../../utils/appError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import prisma from "../../config/dbConfig.js";
import { getUserByEmail } from "../auth/authModel.js";
import {
    createStudentWithUser,
    getStudentById,
    getStudentBySchoolAndAdmissionNumber,
    getStudentsBySchool,
    updateStudent,
    deactivateStudent
} from "./studentModel.js";

export const createStudentService = async (payload) => {
    const {
        fullName,
        email,
        password,
        schoolId,
        admissionNumber,
        gender,
        dateOfBirth,
        bloodGroup,
        admissionDate,
        previousSchool,
        streetAddress,
        city,
        district,
        country,
        fatherName,
        fatherPhone,
        motherName,
        motherPhone,
        guardianName,
        guardianPhone,
        relationToStudent
    } = payload;

    logger.info({ schoolId, email, admissionNumber }, "Creating new student");

    // 1. Verify school exists and is active
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
        throw new AppError("School not found", constants.NotFound);
    }
    if (!school.isActive) {
        throw new AppError("School is currently inactive", constants.Forbidden);
    }

    // 2. Verify email uniqueness
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new AppError("User with this email already exists", constants.Conflict);
    }

    // 3. Verify admission number uniqueness for this school
    const existingAdmission = await getStudentBySchoolAndAdmissionNumber(schoolId, admissionNumber);
    if (existingAdmission) {
        throw new AppError(`Student with admission number '${admissionNumber}' already exists in this school`, constants.Conflict);
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        fullName,
        email,
        password: hashedPassword,
        schoolId,
        role: "STUDENT"
    };

    const studentData = {
        schoolId,
        admissionNumber,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        bloodGroup: bloodGroup || null,
        admissionDate: admissionDate ? new Date(admissionDate) : new Date(),
        previousSchool: previousSchool || null,
        streetAddress: streetAddress || null,
        city: city || null,
        district: district || null,
        country: country || null,
        fatherName: fatherName || null,
        fatherPhone: fatherPhone || null,
        motherName: motherName || null,
        motherPhone: motherPhone || null,
        guardianName: guardianName || null,
        guardianPhone: guardianPhone || null,
        relationToStudent: relationToStudent || null
    };

    const result = await createStudentWithUser({ userData, studentData });

    logger.info({ studentId: result.student.id, userId: result.user.id }, "Student created successfully");

    return {
        statusCode: 201,
        message: "Student created successfully",
        data: {
            id: result.student.id,
            admissionNumber: result.student.admissionNumber,
            user: {
                id: result.user.id,
                fullName: result.user.fullName,
                email: result.user.email,
                role: result.user.role,
                schoolId: result.user.schoolId,
                isActive: result.user.isActive
            }
        }
    };
};

export const getStudentByIdService = async (id) => {
    const student = await getStudentById(id);
    if (!student) {
        throw new AppError("Student not found", constants.NotFound);
    }
    return {
        statusCode: 200,
        message: "Student fetched successfully",
        data: student
    };
};

export const getStudentsBySchoolService = async (schoolId, query) => {
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
        throw new AppError("School not found", constants.NotFound);
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || "";
    const isActive = query.isActive !== undefined ? query.isActive === "true" : undefined;

    const { students, total } = await getStudentsBySchool(schoolId, { skip, take: limit, search, isActive });

    return {
        statusCode: 200,
        message: "Students fetched successfully",
        data: {
            students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    };
};

export const updateStudentService = async (id, updatePayload) => {
    const student = await getStudentById(id);
    if (!student) {
        throw new AppError("Student not found", constants.NotFound);
    }

    const { fullName, isActive, ...studentFields } = updatePayload;

    const userPayload = {};
    if (fullName) userPayload.fullName = fullName;
    if (isActive !== undefined) userPayload.isActive = isActive;

    const studentPayload = { ...studentFields };
    if (studentFields.dateOfBirth) {
        studentPayload.dateOfBirth = new Date(studentFields.dateOfBirth);
    }

    const updated = await updateStudent(id, { userPayload, studentPayload });

    return {
        statusCode: 200,
        message: "Student updated successfully",
        data: updated
    };
};

export const deactivateStudentService = async (id, isActive = false) => {
    const student = await getStudentById(id);
    if (!student) {
        throw new AppError("Student not found", constants.NotFound);
    }

    const updatedUser = await deactivateStudent(id, isActive);
    const actionMessage = isActive ? "Student reactivated successfully" : "Student deactivated successfully";

    return {
        statusCode: 200,
        message: actionMessage,
        data: updatedUser
    };
};
