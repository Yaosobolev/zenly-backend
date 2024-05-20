import { Router } from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getAllFriends,
  getFriendRequest,
} from "../controllers/friendship.controller";

const friendshipRouter = Router();

friendshipRouter.post("/send-friend-request/:senderid", sendFriendRequest);
friendshipRouter.post("/accept-request", acceptFriendRequest);
friendshipRouter.post("/reject-request", rejectFriendRequest);
friendshipRouter.get("/friends", getAllFriends);
friendshipRouter.get("/requests/:userId", getFriendRequest);

export default friendshipRouter;
