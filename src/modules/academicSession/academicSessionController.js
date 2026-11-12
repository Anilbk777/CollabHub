import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
    createAcademicSessionService,
    getAcademicSessionByIdService,
    getAcademicSessionsBySchoolService,
    updateAcademicSessionService,
    toggleAcademicSessionStatusService
} from "./academicSessionService.js";

export const createAcademicSessionController = asyncHandler(async (req, res) => {
    const result = await createAcademicSessionService(req.schoolId, req.body);
    ApiResponse(res, result);
});

export const getAcademicSessionByIdController = asyncHandler(async (req, res) => {
    const result = await getAcademicSessionByIdService(req.schoolId, req.params.id);
    ApiResponse(res, result);
});

export const getAcademicSessionsBySchoolController = asyncHandler(async (req, res) => {
    const result = await getAcademicSessionsBySchoolService(req.schoolId, req.query);
    ApiResponse(res, result);
});

export const updateAcademicSessionController = asyncHandler(async (req, res) => {
    const result = await updateAcademicSessionService(req.schoolId, req.params.id, req.body);
    ApiResponse(res, result);
});

export const toggleAcademicSessionStatusController = asyncHandler(async (req, res) => {
    const result = await toggleAcademicSessionStatusService(req.schoolId, req.params.id);
    ApiResponse(res, result);
});
