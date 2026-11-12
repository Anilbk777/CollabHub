import prisma from "../../config/dbConfig.js";

export const createUser = async (userData) => {
    return await prisma.user.create({
        data: userData
    })
}

export const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    })
}

export const getUserById = async (userId) => {
    return await prisma.user.findUnique({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            profileImg: true,
            isActive: true,
            schoolId: true,
            createdAt: true,
            updatedAt: true
        },
        where: { id: userId }
    })
}

export const createRefreshToken = async (data) => {
    return await prisma.refreshToken.create({
        data
    });
}

export const findSessionByToken = async (tokenHash) => {
    return await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    schoolId: true,
                    isActive: true
                }
            }
        }
    })
}

export const revokeRefreshToken = async (tokenHash) => {
    return await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true }
    })
}

export const revokeAllUserRefreshTokens = async (userId) => {
    return await prisma.refreshToken.updateMany({
        where: { userId },
        data: { revoked: true }
    })
}

export const updateAvatar = async (userId, profileImg) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { profileImg },
        select: {
            id: true,
            fullName: true,
            email: true,
            profileImg: true
        }
    })
}

export const deleteAvatar = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { profileImg: null },
        select: {
            id: true,
            fullName: true,
            email: true,
            profileImg: true
        }
    })
}