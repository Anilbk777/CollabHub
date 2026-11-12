import AppError from "../utils/appError.js";
import constants from "../utils/constants.js";
import prisma from "../config/dbConfig.js";

export const validateSchoolId = async (req, res, next) => {
    try {

        if (!req.schoolId) {
            return next(new AppError("schoolId is required for this operation", constants.BadRequest));
        }

        const school = await prisma.school.findUnique({
            where: { id: req.schoolId }
        });

        if (!school) {
            return next(new AppError("School not found", constants.NotFound));
        }

        if (!school.isActive) {
            return next(new AppError("School is currently inactive", constants.Forbidden));
        }
        next();
    } catch (error) {
        next(error);
    }
};
