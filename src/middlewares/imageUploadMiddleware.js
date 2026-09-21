import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

const validateFile = async (fileBuffer) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const fileType = await fileTypeFromBuffer(fileBuffer);

    // Returns true if valid, false if invalid or undefined
    return allowedTypes.includes(fileType?.mime);
};

const uploadImage = (req, res, next) => {
    upload.single("avatar")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            const message = err.code === "LIMIT_FILE_SIZE"
                ? "Image must be under 5MB"
                : "Upload error";
            return res.status(constants.BadRequest).json({ success: false, message });
        }
        if (err) return next(err); // some other unexpected error

        if (!req.file) {
            return res.status(constants.BadRequest).json({
                statusCode: constants.BadRequest,
                success: false,
                message: "No file uploaded"
            });
        }

        next();
    });
};
export { uploadImage, validateFile };