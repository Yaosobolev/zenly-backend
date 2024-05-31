import { protectRoute } from "../middleware/protectRoute.middleware";
import {
  sendMessageRequest,
  getMessageRequest,
} from "../controllers/message.controller";
import { Router } from "express";

const messageRouter = Router();

messageRouter.post("/send/:userId", protectRoute, sendMessageRequest);
messageRouter.get("/:userId", protectRoute, getMessageRequest);

export default messageRouter;
