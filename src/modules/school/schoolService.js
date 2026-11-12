import AppError from "../../utils/appError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import {
    createSchool,
    getSchoolById,
    getSchoolBySlug,
    getAllSchools,
    updateSchool,
    deactivateSchool,
    getSchoolByName,
    
} from "./schoolModel.js";

const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

export const createSchoolService = async (user, schoolData) => {
    logger.info({ userId: user.id, name: schoolData.name }, "Creating new school");

    if (user.schoolId) {
        throw new AppError("User already has a school", constants.BadRequest);
    }

    const existingName = await getSchoolByName(schoolData.name);
    if (existingName) {
        throw new AppError(`School with name '${schoolData.name}' already exists`, constants.Conflict);
    }

    const slug = generateSlug(schoolData.name);

    const school = await createSchool(schoolData, slug, user.id);

    logger.info({ schoolId: school.id }, "School created successfully");
    return {
        statusCode: 201,
        message: "School created successfully",
        data: school
    };
};

export const getSchoolByIdService = async (id) => {
    const school = await getSchoolById(id);
    if (!school) {
        throw new AppError("School not found", constants.NotFound);
    }
    return {
        statusCode: 200,
        message: "School fetched successfully",
        data: school
    };
};

export const getAllSchoolsService = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || "";
    const isActive = query.isActive !== undefined ? query.isActive === "true" : undefined;

    const { schools, total } = await getAllSchools({ skip, take: limit, search, isActive });

    return {
        statusCode: 200,
        message: "Schools fetched successfully",
        data: {
            schools,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    };
};

export const updateSchoolService = async (id, updateData) => {
    logger.info({ schoolId: id }, "Updating school");
    const school = await getSchoolById(id);
    if (!school) {
        throw new AppError("School not found", constants.NotFound);
    }

    if (updateData.slug && updateData.slug !== school.slug) {
        const existingSlug = await getSchoolBySlug(updateData.slug);
        if (existingSlug) {
            throw new AppError(`School with slug '${updateData.slug}' already exists`, constants.Conflict);
        }
    } else if (updateData.name && !updateData.slug) {
        const newSlug = generateSlug(updateData.name);
        if (newSlug !== school.slug) {
            const existingSlug = await getSchoolBySlug(newSlug);
            if (!existingSlug) {
                updateData.slug = newSlug;
            }
        }
    }

    const updatedSchool = await updateSchool(id, updateData);
    logger.info({ schoolId: id }, "School updated successfully");

    return {
        statusCode: 200,
        message: "School updated successfully",
        data: updatedSchool
    };
};

export const deactivateSchoolService = async (id, isActive = false) => {
    logger.info({ schoolId: id, isActive }, "Toggling school active status");
    const school = await getSchoolById(id);
    if (!school) {
        throw new AppError("School not found", constants.NotFound);
    }

    const updatedSchool = await deactivateSchool(id, isActive);
    const actionMessage = isActive ? "School reactivated successfully" : "School deactivated successfully";

    return {
        statusCode: 200,
        message: actionMessage,
        data: updatedSchool
    };
};
