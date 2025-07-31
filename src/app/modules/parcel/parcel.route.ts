import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { validateParcels } from "../../middlewares/validateParcels";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZod, parcelStatusZod } from "./parcel.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.SENDER, Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createParcelZod),
  validateParcels(),
  ParcelController.createParcel
);

router.patch(
  "/approve/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.approveParcel
);
router.patch(
  "/status/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_PERSONNEL),
  validateRequest(parcelStatusZod),
  ParcelController.updateStatus
);
router.post(
  "/confirm-delivery/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.RECEIVER)
);
router.post(
  "/cancel/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER)
);
router.get("/:tracking_id", checkAuth(...Object.values(Role)));
router.get("/me", checkAuth(...Object.values(Role)));
router.get("/all-parcels", checkAuth(Role.ADMIN, Role.SUPER_ADMIN));
export const ParcelRoutes = router;
