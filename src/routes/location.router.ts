import { Router } from "express";

import {
  setLocationRequest,
  getLocationRequest,
} from "../controllers/location.controller";
import { protectRoute } from "../middleware/protectRoute.middleware";

const locationRouter = Router();

locationRouter.post("/:userId", protectRoute, setLocationRequest);
locationRouter.get("/:userId", protectRoute, getLocationRequest);

export default locationRouter;
