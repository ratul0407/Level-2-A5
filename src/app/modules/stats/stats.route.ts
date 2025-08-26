import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get(
  "/parcels",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getParcelStats
);

router.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getUserStats
);

export const StatsRoute = router;
