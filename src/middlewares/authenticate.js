import AppError from "../utils/AppError.js";
import constants from "../utils/constants.js";
import jwt from "jsonwebtoken";

    
const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AppError("Unauthorized", constants.Unauthorized);
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        throw new AppError("Unauthorized", constants.Unauthorized);
    }
}

export default authenticateUser