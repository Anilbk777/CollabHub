import { registerUser, loginUser } from "./authService.js";
import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { setCookie, clearCookie } from "../../utils/cookie.js";

export const registerUserController = asyncHandler(async (req, res) => {
    const result = await registerUser(req.body);
    ApiResponse(res, result)
})

export const loginController = asyncHandler(async (req, res) => {
    const result = await loginUser(req.body);
    setCookie(res, { accessToken: result.data.accessToken, refreshToken: result.data.refreshToken });
    ApiResponse(res, result)
})
