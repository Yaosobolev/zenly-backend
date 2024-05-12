import { Router } from "express";

import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  setLocationRequest,
  getLocationRequest,
} from "../controllers/location.controller";
import { isAuthenticate } from "../middleware/auth.middleware";
import { protectRoute } from "../middleware/protectRoute.middleware";

const locationRouter = Router();

// locationRouter.get("/", getAllLocations);
// locationRouter.get("/:id", getLocationById);
// locationRouter.post("/", createLocation);
// locationRouter.put("/:id", updateLocation);
// locationRouter.delete("/:id", deleteLocation);
locationRouter.post("/", setLocationRequest);
locationRouter.get("/:userId", protectRoute, getLocationRequest);

export default locationRouter;
