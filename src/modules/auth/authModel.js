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
            name: true,
            email: true,
            avatarUrl: true
        },
        where: { id: userId }
    })
}

export const updateRefreshToken = async (userId, data) => {
    return await prisma.user.update({
        where: { id: userId },
        data
    });
}

export const findSessionByToken = async (token) => {
    return await prisma.user.findFirst({
        where: { refreshToken: token }
    })
}

export const updateAvatar = async (userId, avatarUrl) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
        }
    })
}

export const deleteAvatar = async (userId) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: null },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
        }
    })
}