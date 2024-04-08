import { Router } from "express";

import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/auth.controller";

import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/register", validateRegisterInput, signup);
authRouter.post("/login", validateLoginInput, login);
authRouter.post("/logout", logout);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;
