import AppError from "../../utils/appError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import prisma from "../../config/dbConfig.js";
import {
    createAcademicSession,
    getAcademicSessionById,
    getAcademicSessionBySchoolAndYear,
    getAcademicSessionsBySchool,
    updateAcademicSession,
    updateAcademicSessionStatus,
    validateAcademicSessionExistence
} from "./academicSessionModel.js";

export const createAcademicSessionService = async (schoolId, sessionData) => {
    const { academicYear, startDate, endDate, isCurrent } = sessionData;

    logger.info({ schoolId, academicYear }, "Creating academic session");

    const existingSession = await getAcademicSessionBySchoolAndYear(schoolId, academicYear);
    if (existingSession) {
        throw new AppError(`Academic session '${academicYear}' already exists for this school`, constants.Conflict);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const session = await createAcademicSession({
        schoolId,
        academicYear,
        startDate: start,
        endDate: end,
        isCurrent: isCurrent
    });

    logger.info({ sessionId: session.id }, "Academic session created successfully");
    return {
        statusCode: 201,
        message: "Academic session created successfully",
        data: session
    };
};

export const getAcademicSessionByIdService = async (schoolId, id) => {
    const session = await getAcademicSessionById(schoolId, id);
    if (!session) {
        throw new AppError("Academic session not found", constants.NotFound);
    }
    return {
        statusCode: 200,
        message: "Academic session fetched successfully",
        data: session
    };
};

export const getAcademicSessionsBySchoolService = async (schoolId, query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { sessions, total } = await getAcademicSessionsBySchool(schoolId, { skip, take: limit });

    return {
        statusCode: 200,
        message: "Academic sessions fetched successfully",
        data: {
            sessions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    };
};

export const updateAcademicSessionService = async (schoolId, id, updateData) => {
    const existing = await validateAcademicSessionExistence(schoolId, id);
    if (!existing) {
        throw new AppError("Academic session not found", constants.NotFound);
    }

    const payload = { ...updateData };

    if (updateData.startDate) {
        payload.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
        payload.endDate = new Date(updateData.endDate);
    }

    const start = payload.startDate || existing.startDate;
    const end = payload.endDate || existing.endDate;

    if (start >= end) {
        throw new AppError("startDate must be before endDate", constants.BadRequest);
    }

    const updated = await updateAcademicSession(id, payload);

    return {
        statusCode: 200,
        message: "Academic session updated successfully",
        data: updated
    };
};

export const toggleAcademicSessionStatusService = async (schoolId, id) => {
    const existing = await validateAcademicSessionExistence(schoolId, id);
    if (!existing) {
        throw new AppError("Academic session not found", constants.NotFound);
    }
    const status = existing.isCurrent ? false : true;

    const updated = await updateAcademicSessionStatus(id, status);
    const message = updated.isCurrent ? "Academic session marked as active" : "Academic session marked as inactive";

    return {
        statusCode: 200,
        message,
        data: updated
    };
};
