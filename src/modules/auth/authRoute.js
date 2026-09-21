import { Router } from "express";
import { validateRequest } from "../../middlewares/requestValidate.js"
import { RegisterUserSchema, LoginUserSchema } from "./authValidation.js"
import authenticateUser from "../../middlewares/authenticate.js";
import { uploadImage } from "../../middlewares/imageUploadMiddleware.js";
import {
    registerUserController,
    loginController,
    refreshTokenController,
    logoutController,
    meController,
    uploadAvatarController,
    deleteAvatarController
} from "./authController.js"

const authRouter = Router();

authRouter.post("/register", validateRequest(RegisterUserSchema), registerUserController);
authRouter.post("/login", validateRequest(LoginUserSchema), loginController);
authRouter.post("/refresh", refreshTokenController);
authRouter.post("/logout", authenticateUser, logoutController);
authRouter.get("/me", authenticateUser, meController);
authRouter.patch("/me/avatar", authenticateUser, uploadImage, uploadAvatarController);
authRouter.delete("/me/avatar", authenticateUser, deleteAvatarController);

export default authRouter;