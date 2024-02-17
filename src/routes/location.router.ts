import { Router } from "express";

import {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/location.controller";

const locationRouter = Router();

locationRouter.get("/", getAllLocations);
locationRouter.get("/:id", getLocationById);
locationRouter.post("/", createLocation);
locationRouter.put("/:id", updateLocation);
locationRouter.delete("/:id", deleteLocation);

export default locationRouter;
