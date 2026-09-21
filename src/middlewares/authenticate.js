import AppError from "../utils/AppError.js";
import constants from "../utils/constants.js";
import jwt from "jsonwebtoken";
import { getUserById } from "../modules/auth/authModel.js";


const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            throw new AppError("Unauthorized", constants.Unauthorized);
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await getUserById(decoded.id);
        if (!user) {
            throw new AppError("Unauthorized", constants.Unauthorized);
        }
        req.userId = decoded.id;
        req.user = user;
        next();
    } catch (error) {
        throw new AppError("Unauthorized", constants.Unauthorized);
    }
}

export default authenticateUser