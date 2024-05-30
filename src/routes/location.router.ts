import { Router } from "express";

import {
  // getAllLocations,
  // getLocationById,
  // createLocation,
  // updateLocation,
  // deleteLocation,
  setLocationRequest,
  getLocationRequest,
} from "../controllers/location.controller";
import { protectRoute } from "../middleware/protectRoute.middleware";

const locationRouter = Router();

// locationRouter.get("/", getAllLocations);
// locationRouter.get("/:id", getLocationById);
// locationRouter.post("/", createLocation);
// locationRouter.put("/:id", updateLocation);
// locationRouter.delete("/:id", deleteLocation);
locationRouter.post("/:userId", setLocationRequest);
locationRouter.get("/:userId", getLocationRequest);

export default locationRouter;
