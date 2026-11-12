import { Router } from "express";
import authenticateUser from "../../middlewares/authenticate.js";
import { authorizeRoles } from "../../middlewares/authorizeRoles.js";
import { validateSchoolId } from "../../middlewares/validateSchoolId.js";
import { validateRequest, validateParams, validateQuery } from "../../middlewares/requestValidate.js";
import {
    CreateAcademicSessionSchema,
    UpdateAcademicSessionSchema,
    uuidSchema,
    PaginationQuerySchema
} from "./academicSessionValidation.js";
import {
    createAcademicSessionController,
    getAcademicSessionByIdController,
    getAcademicSessionsBySchoolController,
    updateAcademicSessionController,
    toggleAcademicSessionStatusController
} from "./academicSessionController.js";

const academicSessionRouter = Router();

academicSessionRouter.use(authenticateUser);

academicSessionRouter.post(
    "/",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    validateSchoolId,
    validateRequest(CreateAcademicSessionSchema),
    createAcademicSessionController
);

academicSessionRouter.get(
    "/",
    validateSchoolId,
    validateQuery(PaginationQuerySchema),
    getAcademicSessionsBySchoolController
);

academicSessionRouter.get(
    "/:id",
    validateSchoolId,
    validateParams(uuidSchema),
    getAcademicSessionByIdController
);

academicSessionRouter.put(
    "/:id",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    validateSchoolId,
    validateParams(uuidSchema),
    validateRequest(UpdateAcademicSessionSchema),
    updateAcademicSessionController
);

academicSessionRouter.patch(
    "/:id/toggle-status",
    authorizeRoles("SUPER_ADMIN", "ADMIN"),
    validateSchoolId,
    validateParams(uuidSchema),
    toggleAcademicSessionStatusController
);


export default academicSessionRouter;
