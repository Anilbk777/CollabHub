import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
    createSchoolService,
    getSchoolByIdService,
    getAllSchoolsService,
    updateSchoolService,
    deactivateSchoolService
} from "./schoolService.js";

export const createSchoolController = asyncHandler(async (req, res) => {
    const result = await createSchoolService(req.user, req.body);
    ApiResponse(res, result);
});

export const getSchoolByIdController = asyncHandler(async (req, res) => {
    const result = await getSchoolByIdService(req.params.id);
    ApiResponse(res, result);
});

export const getAllSchoolsController = asyncHandler(async (req, res) => {
    const result = await getAllSchoolsService(req.query);
    ApiResponse(res, result);
});

export const updateSchoolController = asyncHandler(async (req, res) => {
    const result = await updateSchoolService(req.params.id, req.body);
    ApiResponse(res, result);
});

export const deactivateSchoolController = asyncHandler(async (req, res) => {
    const isActive = req.body?.isActive !== undefined ? req.body.isActive : false;
    const result = await deactivateSchoolService(req.params.id, isActive);
    ApiResponse(res, result);
});
