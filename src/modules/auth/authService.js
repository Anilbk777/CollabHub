import { createUser, getUserByEmail } from "./authModel.js";
import AppError from "../../utils/AppError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/tokenService.js";

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
            createdAt: user.createdAt,
        }
    }

}

const loginUser = async (body) => {
    logger.info(`Attempting to login user with email: ${body.email}`);
    const { email, password } = body;
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        throw new AppError("Invalid email or password", constants.Unauthorized);
    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", constants.Unauthorized);
    }
    const { accessToken, refreshToken } = generateToken(existingUser.id);
    logger.info(`User logged in successfully with email: ${email}`);
    return {
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        }
    }

}



export {
    registerUser,
    loginUser
}