import { Router } from "express";
import { registerUserController } from "./authController.js"
import { validateRequest } from "../../middlewares/requestValidate.js"
import { RegisterUserSchema } from "./authValidation.js"

const authRouter = Router();

authRouter.post("/register", validateRequest(RegisterUserSchema), registerUserController);

export default authRouter;