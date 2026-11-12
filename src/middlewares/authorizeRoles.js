import AppError from "../utils/appError.js";
import constants from "../utils/constants.js";

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new AppError("Forbidden: You do not have permission to perform this action", constants.Forbidden));
        }
        next();
    };
};
