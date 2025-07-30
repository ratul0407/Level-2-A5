import { Router } from "express";
import { ParcelController } from "./parcel.controller";
import { validateParcels } from "../../middlewares/validateParcels";

const router = Router();

router.post("/create", validateParcels(), ParcelController.createParcel);

export const ParcelRoutes = router;
