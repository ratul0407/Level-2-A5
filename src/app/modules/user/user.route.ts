import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZod } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZod),
  UserController.createUser
);

export const userRoutes = router;
