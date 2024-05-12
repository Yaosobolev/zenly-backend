import { Router } from "express";

import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getDataUser,
} from "../controllers/auth.controller";

import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/auth.middleware";
import { protectRoute } from "../middleware/protectRoute.middleware";

const authRouter = Router();

authRouter.post("/register", validateRegisterInput, signup);
authRouter.post("/login", validateLoginInput, login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshAccessToken);
authRouter.get("/me/:userId", protectRoute, getDataUser);
authRouter.get("/isAuthenticated", protectRoute);

export default authRouter;
