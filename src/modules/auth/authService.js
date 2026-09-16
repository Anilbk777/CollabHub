import { createUser, getUserByEmail } from "./authModel.js";
import AppError from "../../utils/AppError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";

const registerUser = async (userData) => {
    logger.info(`Attempting to register user with email: ${userData.email}`);
    const { email, password } = userData;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new AppError("User with this email already exists", constants.Conflict);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
        ...userData,
        password: hashedPassword
    };
    const user = await createUser(newUserData);
    logger.info(`User registered successfully with email: ${userData.email}`);
    return {
        statusCode: 201,
        message: "User registered successfully",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        }
    }

}

export {
    registerUser
}