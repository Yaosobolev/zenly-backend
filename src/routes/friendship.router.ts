import { Router } from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getAllFriends,
  getFriendRequest,
} from "../controllers/friendship.controller";
import { protectRoute } from "../middleware/protectRoute.middleware";

const friendshipRouter = Router();

friendshipRouter.post("/send-friend-request/:senderid", sendFriendRequest);
friendshipRouter.post("/accept-request", acceptFriendRequest);
friendshipRouter.post("/reject-request", rejectFriendRequest);
friendshipRouter.get("/friends/:userId", protectRoute, getAllFriends);
friendshipRouter.get("/requests/:userId", protectRoute, getFriendRequest);

export default friendshipRouter;
