import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZod, updateUserZod } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZod),
  UserController.createUser
);

router.patch("/:id", validateRequest(updateUserZod), UserController.updateUser);
export const UserRoutes = router;
