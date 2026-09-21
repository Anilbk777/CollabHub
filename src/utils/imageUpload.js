import { v2 as cloudinary } from 'cloudinary';
import logger from "./logger.js";
import AppError from "./AppError.js";
import constants from "./constants.js";

export const uploadOnCloudinary = async (userId, buffer) => {
    try {
        const result = await new Promise((resolve, reject) => {
            // 1. Store the returned stream into a variable
            const cldStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avatars",
                    public_id: userId,
                    overwrite: true,
                    invalidate: true,
                    format: "webp",
                    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
                },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            
            // 2. Write the buffer and end the stream safely
            cldStream.end(buffer);
        });
        
        logger.info({ userId }, "Avatar uploaded successfully.");
        return result.secure_url;
    } catch (error) {
        logger.error({ userId, error }, "Failed to upload avatar on Cloudinary.");
        throw new AppError("Failed to upload avatar", constants.InternalServerError);
    }
};

export const deleteFromCloudinary = async (userId) => {
    try {
        return await cloudinary.uploader.destroy(`avatars/${userId}`);
    } catch (error) {
        logger.error({ userId, error: error.message }, "Failed to delete avatar on Cloudinary.");
        throw new AppError("Failed to delete avatar", constants.InternalServerError);
    }
}
