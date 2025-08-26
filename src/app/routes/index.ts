import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ParcelRoutes } from "../modules/parcel/parcel.route";
import { StatsRoute } from "../modules/stats/stats.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/parcel",
    route: ParcelRoutes,
  },
  {
    path: "/stats",
    route: StatsRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
