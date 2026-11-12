import AppError from "../../utils/AppError.js";
import constants from "../../utils/constants.js";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import { generateToken, hashToken } from "../../utils/tokenService.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/imageUpload.js";
import { validateFile } from "../../middlewares/imageUploadMiddleware.js";
import {
    createUser,
    getUserByEmail,
    findSessionByToken,
    createRefreshToken,
    revokeRefreshToken,
    updateAvatar,
    deleteAvatar
} from "./authModel.js";

const registerUser = async (userData) => {
    const { email, password, fullName } = userData;
    logger.info({ email }, "Attempting to register user");

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new AppError("User with this email already exists", constants.Conflict);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = {
        fullName,
        email,
        password: hashedPassword,
    };
    const user = await createUser(newUserData);
    logger.info({ id: user.id, email: user.email }, "User registered successfully");
    return {
        statusCode: 201,
        message: "User registered successfully",
        data: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        }
    }
}

const loginUser = async (body) => {
    const { email, password } = body;
    logger.info({ email }, "Attempting to login user");

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        throw new AppError("Invalid email or password", constants.Unauthorized);
    }

    if (!existingUser.isActive) {
        throw new AppError("Your account has been deactivated. Please contact support.", constants.Forbidden);
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", constants.Unauthorized);
    }

    const { accessToken, refreshToken, hashedRefreshToken, refreshExpiresAt } = generateToken(existingUser);

    await createRefreshToken({
        userId: existingUser.id,
        tokenHash: hashedRefreshToken,
        expiresAt: refreshExpiresAt
    });

    logger.info({ userId: existingUser.id, email: existingUser.email }, "User logged in successfully");
    return {
        statusCode: 200,
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken,
            user: {
                id: existingUser.id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                role: existingUser.role,
                schoolId: existingUser.schoolId
            }
        }
    }
}

const refreshTokenService = async (incomingRefreshToken) => {
    logger.info("Refreshing access token");

    if (!incomingRefreshToken) {
        throw new AppError("Refresh token missing", constants.BadRequest);
    }

    const hashedIncoming = hashToken(incomingRefreshToken);
    const session = await findSessionByToken(hashedIncoming);

    if (!session || session.revoked) {
        throw new AppError("Invalid or revoked refresh token", constants.Unauthorized);
    }

    if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
        throw new AppError("Refresh token expired. Please log in again.", constants.Unauthorized);
    }

    if (!session.user || !session.user.isActive) {
        throw new AppError("User account is inactive", constants.Forbidden);
    }

    // Revoke old session
    await revokeRefreshToken(hashedIncoming);

    // Generate new token pair
    const { accessToken, refreshToken: newRefreshToken, hashedRefreshToken: newHashedToken, refreshExpiresAt } = generateToken(session.user);

    // Save new session
    await createRefreshToken({
        userId: session.user.id,
        tokenHash: newHashedToken,
        expiresAt: refreshExpiresAt
    });

    logger.info({ userId: session.user.id }, "New access and refresh token generated successfully.");

    return {
        statusCode: 200,
        message: "New Access and Refresh token generated successfully",
        data: {
            accessToken,
            refreshToken: newRefreshToken
        }
    }
}

const logoutService = async (incomingRefreshToken) => {
    logger.info(`Attempting to logout`);
    if (!incomingRefreshToken) {
        throw new AppError("Refresh token missing", constants.BadRequest);
    }

    const hashedIncoming = hashToken(incomingRefreshToken);
    await revokeRefreshToken(hashedIncoming);

    logger.info("User logged out successfully.");
    return {
        statusCode: 200,
        message: "User logged out successfully"
    }
}

const meService = async (user) => {
    return {
        statusCode: 200,
        message: "User profile fetched successfully",
        data: user
    }
}

const updateAvatarService = async (userId, file) => {
    logger.info({ userId }, "Attempting to upload profile image");
    if (!file) {
        throw new AppError("No file uploaded", constants.BadRequest);
    }
    const isAllowed = await validateFile(file.buffer);
    if (!isAllowed) {
        throw new AppError("File type not allowed", constants.BadRequest);
    }
    const url = await uploadOnCloudinary(userId, file.buffer);
    const updateAvatarResult = await updateAvatar(userId, url);
    logger.info({ userId }, "Profile image uploaded successfully.");
    return {
        statusCode: 200,
        message: "Profile image uploaded successfully",
        data: {
            profileImg: updateAvatarResult.profileImg
        }
    }
}

const deleteAvatarService = async (user) => {
    logger.info({ userId: user.id }, "Attempting to delete profile image");
    if (!user.profileImg) {
        throw new AppError("No profile image to delete", constants.BadRequest);
    }
    await deleteFromCloudinary(user.id);
    const deleteResult = await deleteAvatar(user.id);
    logger.info({ userId: user.id }, "Profile image deleted successfully.");
    return {
        statusCode: 200,
        message: "Profile image deleted successfully",
        data: {
            profileImg: deleteResult.profileImg
        }
    }
}

export {
    registerUser,
    loginUser,
    refreshTokenService,
    logoutService,
    meService,
    updateAvatarService,
    deleteAvatarService
}