import { Router } from "express";
import authenticateUser from "../../middlewares/authenticate.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";
import { validateRequest } from "../../middlewares/requestValidate.js";
import { CreateSchoolSchema, UpdateSchoolSchema } from "./schoolValidation.js";
import {
    createSchoolController,
    getSchoolByIdController,
    getAllSchoolsController,
    updateSchoolController,
    deactivateSchoolController
} from "./schoolController.js";

const schoolRouter = Router();

schoolRouter.use(authenticateUser);

schoolRouter.post(
    "/",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    validateRequest(CreateSchoolSchema),
    createSchoolController
);

schoolRouter.get("/", getAllSchoolsController);
schoolRouter.get("/:id", getSchoolByIdController);

schoolRouter.patch(
    "/:id",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    validateRequest(UpdateSchoolSchema),
    updateSchoolController
);

// Soft delete / deactivation endpoint
schoolRouter.patch(
    "/:id/deactivate",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    deactivateSchoolController
);

schoolRouter.delete(
    "/:id",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    deactivateSchoolController
);

export default schoolRouter;
