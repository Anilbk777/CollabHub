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