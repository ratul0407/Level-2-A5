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
  checkAuth(Role.SENDER, Role.ADMIN),
  validateRequest(createParcelZod),
  validateParcels(),
  ParcelController.createParcel
);

router.post("/approve", checkAuth(Role.ADMIN), ParcelController.approveParcel);
export const ParcelRoutes = router;
