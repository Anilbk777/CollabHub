import { createUser, getUserByEmail, findSessionByToken, updateRefreshToken } from "./authModel.js";
import AppError from "../../utils/AppError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    const { accessToken, hashedRefreshToken, refreshExpiresAt } = generateToken(existingUser.id);
    await updateRefreshToken(existingUser.id, { refreshToken: hashedRefreshToken, refreshExpiresAt });
    logger.info(`User logged in successfully with email: ${email}`);
    return {
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken: hashedRefreshToken,
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email
            }
        }
    }

}

const refreshTokenService = async (incomingRefreshToken) => {
    logger.info("Getting a new access and refresh token started.", incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new AppError("Refresh token missing", constants.NotFound);
    }
    const session = await findSessionByToken(incomingRefreshToken);

    if (!session) {
        throw new AppError("Invalid refresh token", constants.Unauthorized);
    }
    if (session.refreshExpiresAt && session.refreshExpiresAt.getTime() < Date.now()) {
        throw new AppError("Refresh token expired. Please log in again.", constants.Unauthorized);
    }

    const { accessToken, hashedRefreshToken: newHashedRefreshToken, refreshExpiresAt } = generateToken(session.id);
    await updateRefreshToken(session.id, { refreshToken: newHashedRefreshToken, refreshExpiresAt });
    logger.info({ userId: session.id, }, "New access and refresh token generated successfully.")

    return {
        statusCode: 200,
        message: "New Access and Refresh token generated successful",
        data: {
            accessToken,
            refreshToken: newHashedRefreshToken
        }
    }
}

const logoutService = async (incomingRefreshToken) => {
    logger.info(`Attempting to logout with refresh token`);
    if (!incomingRefreshToken) {
        throw new AppError("Refresh token missing", constants.NotFound);
    }
    const session = await findSessionByToken(incomingRefreshToken);
    if (!session || (session.refreshExpiresAt && Date.now() > session.refreshExpiresAt.getTime())) {
        throw new AppError("Invalid or expired refresh token", constants.Unauthorized);
    }
    await updateRefreshToken(session.id, { refreshToken: null, refreshExpiresAt: null });

    logger.info({ userId: session.id, }, "User logged out successfully.")
    return {
        statusCode: 200,
        message: "User logged out successfully"
    }

}


export {
    registerUser,
    loginUser,
    refreshTokenService,
    logoutService
}