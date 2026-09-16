import { registerUser } from "./authService.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const registerUserController = asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);
    ApiResponse(res, result)
})
