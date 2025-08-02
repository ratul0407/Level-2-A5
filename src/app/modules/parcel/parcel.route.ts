import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { validateParcels } from "../../middlewares/validateParcels";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZod, parcelStatusZod } from "./parcel.validation";
import { checkParcels } from "../../middlewares/checkParcels";

const router = Router();

// create parcel
router.post(
  "/create",
  checkAuth(Role.SENDER, Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createParcelZod),
  validateParcels(),
  ParcelController.createParcel
);

// admin approval
router.patch(
  "/approve/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  checkParcels(),
  ParcelController.approveParcel
);

// delivery personnel's status update route
router.patch(
  "/status/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DELIVERY_PERSONNEL),
  checkParcels(),
  validateRequest(parcelStatusZod),
  ParcelController.updateStatus
);

//cancel route for sender and receiver
router.patch(
  "/cancel/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.SENDER, Role.RECEIVER),
  checkParcels(),
  ParcelController.cancelParcel
);

//delivery confirmation from the receiver
router.patch(
  "/confirm-delivery/:tracking_id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.RECEIVER),
  checkParcels(),
  ParcelController.confirmDelivery
);
//all parcels route for admin
router.get(
  "/all-parcels",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelController.getAllParcels
);

//get a single parcel by tracking id
router.get(
  "/:tracking_id",
  checkAuth(...Object.values(Role)),
  ParcelController.getParcelByTrackingId
);

//get all parcels of a single user
router.get(
  "/my-parcels/:id",
  checkAuth(...Object.values(Role)),
  ParcelController.getMyParcels
);
export const ParcelRoutes = router;
