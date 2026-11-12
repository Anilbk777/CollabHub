import prisma from "../../config/dbConfig.js";

export const createAcademicSession = async (data) => {
    // If it's not the current session, just run a standard creation
    if (!data.isCurrent) {
        return await prisma.academicSession.create({ data });
    }

    // Run sequentially inside a transaction to prevent race conditions
    return await prisma.$transaction(async (tx) => {
        await tx.academicSession.updateMany({
            where: { schoolId: data.schoolId },
            data: { isCurrent: false }
        });

        return await tx.academicSession.create({ data });
    });
};

export const getAcademicSessionById = async (schoolId, id) => {
    return await prisma.academicSession.findFirst({
        where: {
            id,
            schoolId
        },
        include: {
            school: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            }
        }
    });
};
export const validateAcademicSessionExistence = async (schoolId, id) => {
    return await prisma.academicSession.findFirst({
        where: {
            id,
            schoolId
        }
    });

};

export const getAcademicSessionBySchoolAndYear = async (schoolId, academicYear) => {
    return await prisma.academicSession.findUnique({
        where: {
            schoolId_academicYear: {
                schoolId,
                academicYear
            }
        }
    });
};

export const getAcademicSessionsBySchool = async (schoolId, { skip = 0, take = 10 }) => {
    const where = { schoolId };

    const [sessions, total] = await Promise.all([
        prisma.academicSession.findMany({
            where,
            skip,
            take,
            orderBy: { startDate: "desc" },
            include: {
                school: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        }),
        prisma.academicSession.count({ where })
    ]);

    return { sessions, total };
};

export const updateAcademicSession = async (id, data) => {
    if (data.isCurrent) {
        const session = await prisma.academicSession.findUnique({ where: { id } });
        if (session) {
            return await prisma.$transaction(async (tx) => {
                await tx.academicSession.updateMany({
                    where: { schoolId: session.schoolId },
                    data: { isCurrent: false }
                });

                return await tx.academicSession.update({
                    where: { id },
                    data
                });
            });
        }
    }

    return await prisma.academicSession.update({
        where: { id },
        data
    });
};

export const updateAcademicSessionStatus = async (id, status) => {
    return await prisma.academicSession.update({
        where: { id },
        data: { isCurrent: status }
    });
};
