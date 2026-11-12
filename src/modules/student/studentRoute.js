import { Router } from "express";
import authenticateUser from "../../middlewares/authenticate.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";
import { validateSchoolId } from "../../middlewares/validateSchoolId.js";
import {
  validateRequest,
  validateParams,
  validateQuery,
} from "../../middlewares/requestValidate.js";
import {
  CreateStudentSchema,
  UpdateStudentSchema,
  StudentQuerySchema,
  StudentIdParamSchema,
} from "./studentValidation.js";
import {
  createStudentController,
  getStudentByIdController,
  getStudentsBySchoolController,
  updateStudentController,
  deactivateStudentController,
} from "./studentController.js";

const studentRouter = Router();

studentRouter.use(authenticateUser);

studentRouter.post(
  "/",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  validateSchoolId,
  validateRequest(CreateStudentSchema),
  createStudentController,
);

studentRouter.get("/", validateSchoolId, getStudentsBySchoolController);

studentRouter.get(
  "/:id",
  validateParams(StudentIdParamSchema),
  getStudentByIdController,
);

studentRouter.patch(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  validateSchoolId,
  validateParams(StudentIdParamSchema),
  validateRequest(UpdateStudentSchema),
  updateStudentController,
);

studentRouter.patch(
  "/:id/deactivate",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  validateParams(StudentIdParamSchema),
  deactivateStudentController,
);

studentRouter.delete(
  "/:id",
  authorizeRoles("SUPER_ADMIN", "ADMIN"),
  validateParams(StudentIdParamSchema),
  deactivateStudentController,
);

export default studentRouter;
