import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { validateParcels } from "../../middlewares/validateParcels";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SENDER, Role.ADMIN),
  validateParcels(),
  ParcelController.createParcel
);

export const ParcelRoutes = router;
