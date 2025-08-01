import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZod, updateUserZod } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZod),
  UserController.createUser
);

router.patch("/:id", validateRequest(updateUserZod), UserController.updateUser);
router.get(
  "/my-parcels/:id",
  checkAuth(...Object.values(Role)),
  UserController.getMyParcels
);
export const UserRoutes = router;
