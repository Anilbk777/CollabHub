import jwt from "jsonwebtoken"
import crypto from "crypto"

const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
    });
}

export const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

// Hashes the refresh token string using SHA-256
const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

const generateToken = (userId) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashToken(refreshToken);

    return { accessToken, hashedRefreshToken, refreshExpiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS) };
}

export {
    generateToken,
    hashToken
}