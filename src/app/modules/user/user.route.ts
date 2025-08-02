import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZod, updateUserZod, userActivity } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZod),

  UserController.createUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZod),
  UserController.updateUser
);

router.patch(
  "/change-activity/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(userActivity),
  UserController.changeUserActivity
);
export const UserRoutes = router;
