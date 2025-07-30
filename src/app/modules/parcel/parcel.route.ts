import { Router } from "express";
import { ParcelController } from "./parcel.controller";

const router = Router();

router.post("/create", ParcelController.createParcel);

export const ParcelRoutes = router;
