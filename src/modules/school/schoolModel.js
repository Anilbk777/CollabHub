import prisma from "../../config/dbConfig.js";

export const getSchoolByName = async (name) => {
  return await prisma.school.findUnique({
    where: { name },
  });
};

export const createSchool = async (schoolData, slug, userId) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Create the school
    const newSchool = await tx.school.create({
      data: {
        ...schoolData,
        slug,
      },
    });

    // 2. Assign the created school's ID to the user
    await tx.user.update({
      where: { id: userId },
      data: { schoolId: newSchool.id },
    });

    return newSchool;
  });
};

export const getSchoolById = async (id) => {
  return await prisma.school.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          users: true,
          students: true,
          academicSessions: true,
        },
      },
    },
  });
};

export const getSchoolBySlug = async (slug) => {
  return await prisma.school.findFirst({
    where: { slug },
  });
};

export const getAllSchools = async ({
  skip = 0,
  take = 10,
  search = "",
  isActive,
}) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isActive !== undefined) {
    where.isActive = isActive;
  }

  const [schools, total] = await Promise.all([
    prisma.school.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            users: true,
            students: true,
            academicSessions: true,
          },
        },
      },
    }),
    prisma.school.count({ where }),
  ]);

  return { schools, total };
};

export const updateSchool = async (id, data) => {
  return await prisma.school.update({
    where: { id },
    data,
  });
};

// Soft delete / Deactivate school
export const deactivateSchool = async (id, isActive = false) => {
  return await prisma.school.update({
    where: { id },
    data: { isActive },
  });
};
