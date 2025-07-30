import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { validateParcels } from "../../middlewares/validateParcels";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZod } from "./parcel.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(createParcelZod),
  checkAuth(Role.SENDER, Role.ADMIN),
  validateParcels(),
  ParcelController.createParcel
);

export const ParcelRoutes = router;
