import { Router } from "express";
import { registerUserController, loginController } from "./authController.js"
import { validateRequest } from "../../middlewares/requestValidate.js"
import { RegisterUserSchema, LoginUserSchema } from "./authValidation.js"

const authRouter = Router();

authRouter.post("/register", validateRequest(RegisterUserSchema), registerUserController);
authRouter.post("/login", validateRequest(LoginUserSchema), loginController);

export default authRouter;