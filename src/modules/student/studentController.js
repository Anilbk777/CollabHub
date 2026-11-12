import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
    createStudentService,
    getStudentByIdService,
    getStudentsBySchoolService,
    updateStudentService,
    deactivateStudentService
} from "./studentService.js";

export const createStudentController = asyncHandler(async (req, res) => {
    const schoolId = req.body.schoolId || req.schoolId;
    const result = await createStudentService({ ...req.body, schoolId });
    ApiResponse(res, result);
});

export const getStudentByIdController = asyncHandler(async (req, res) => {
    const result = await getStudentByIdService(req.params.id);
    ApiResponse(res, result);
});

export const getStudentsBySchoolController = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId;
    const result = await getStudentsBySchoolService(schoolId, req.query);
    ApiResponse(res, result);
});

export const updateStudentController = asyncHandler(async (req, res) => {
    const result = await updateStudentService(req.params.id, req.body);
    ApiResponse(res, result);
});

export const deactivateStudentController = asyncHandler(async (req, res) => {
    const isActive = req.body?.isActive !== undefined ? req.body.isActive : false;
    const result = await deactivateStudentService(req.params.id, isActive);
    ApiResponse(res, result);
});
