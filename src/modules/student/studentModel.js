import prisma from "../../config/dbConfig.js";

export const createStudentWithUser = async ({ userData, studentData }) => {
    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                ...userData,
                role: "STUDENT"
            }
        });

        const student = await tx.student.create({
            data: {
                ...studentData,
                userId: user.id
            }
        });

        return { user, student };
    });
};

export const getStudentById = async (id) => {
    return await prisma.student.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    profileImg: true,
                    isActive: true,
                    createdAt: true
                }
            },
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

export const getStudentByUserId = async (userId) => {
    return await prisma.student.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    profileImg: true,
                    isActive: true
                }
            },
            school: true
        }
    });
};

export const getStudentBySchoolAndAdmissionNumber = async (schoolId, admissionNumber) => {
    return await prisma.student.findUnique({
        where: {
            schoolId_admissionNumber: {
                schoolId,
                admissionNumber
            }
        }
    });
};

export const getStudentsBySchool = async (schoolId, { skip = 0, take = 10, search = "", isActive }) => {
    const where = { schoolId };

    if (search) {
        where.OR = [
            { admissionNumber: { contains: search, mode: "insensitive" } },
            {
                user: {
                    fullName: { contains: search, mode: "insensitive" }
                }
            },
            {
                user: {
                    email: { contains: search, mode: "insensitive" }
                }
            }
        ];
    }

    if (isActive !== undefined) {
        where.user = {
            ...where.user,
            isActive
        };
    }

    const [students, total] = await Promise.all([
        prisma.student.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profileImg: true,
                        isActive: true
                    }
                },
                school: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                }
            }
        }),
        prisma.student.count({ where })
    ]);

    return { students, total };
};

export const updateStudent = async (id, { userPayload, studentPayload }) => {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return null;

    return await prisma.$transaction(async (tx) => {
        if (userPayload && Object.keys(userPayload).length > 0) {
            await tx.user.update({
                where: { id: student.userId },
                data: userPayload
            });
        }

        if (studentPayload && Object.keys(studentPayload).length > 0) {
            await tx.student.update({
                where: { id },
                data: studentPayload
            });
        }

        return await tx.student.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profileImg: true,
                        isActive: true
                    }
                },
                school: true
            }
        });
    });
};

// Soft delete / deactivation: deactivates linked user account
export const deactivateStudent = async (id, isActive = false) => {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return null;

    return await prisma.user.update({
        where: { id: student.userId },
        data: { isActive },
        select: {
            id: true,
            fullName: true,
            email: true,
            isActive: true
        }
    });
};
