import { Request, Response } from "express";

import {
  createFriendRequest,
  processFriendRequest,
} from "../service/friendship.service";
import { getFriendsById, getFriendRequests } from "../service/user.service";
import { io } from "../index";
import { sendSocketToReceiver } from "../socket";

export const sendFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { receiverId } = req.body;
  const { senderid } = req.params;
  const senderId = senderid;

  try {
    const newFriendshipRequest = await createFriendRequest(
      Number(senderId),
      Number(receiverId),
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          sendSocketToReceiver(io, receiverId, result, "friend-requests");

          res.status(201).json({
            message: "Заявка отправлена",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки заявки:", error);

    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};

export const getFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const requests = await getFriendRequests(Number(userId), (result: any) => {
      if (result instanceof Error) {
        throw result;
      } else {
        res.status(200).json({
          data: result,
        });
      }
    });
  } catch (error) {
    console.error("Ошибка получения друзей:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};

export const acceptFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await processFriendRequest(
      requestId,
      "ACCEPTED",
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          const { sender, ...resultForSender } = result;
          const { receiver, ...resultForReceiver } = result;

          sendSocketToReceiver(
            io,
            result.sender.id,
            resultForSender,
            "new-friend"
          );
          sendSocketToReceiver(
            io,
            result.receiver.id,
            resultForReceiver,
            "new-friend"
          );
          sendSocketToReceiver(
            io,
            result.sender.id,
            resultForSender,
            "new-geo-friend"
          );
          sendSocketToReceiver(
            io,
            result.receiver.id,
            resultForReceiver,
            "new-geo-friend"
          );

          res.status(200).json({
            message: "Заявка принята",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
export const rejectFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { requestId } = req.body;
  try {
    const updatedRequest = await processFriendRequest(
      requestId,
      "REJECTED",
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          const { sender, ...resultForSender } = result;
          const { receiver, ...resultForReceiver } = result;

          console.log("result.sender.id", result.sender.id);
          console.log("result.receiver.id", result.receiver.id);

          console.log("resultForSender", resultForSender);
          console.log("resultForReceiver", resultForReceiver);

          sendSocketToReceiver(
            io,
            result.sender.id,
            resultForSender,
            "delete-friend"
          );
          sendSocketToReceiver(
            io,
            result.receiver.id,
            resultForReceiver,
            "delete-friend"
          );

          sendSocketToReceiver(
            io,
            result.sender.id,
            resultForSender,
            "delete-geo-friend"
          );
          sendSocketToReceiver(
            io,
            result.receiver.id,
            resultForReceiver,
            "delete-geo-friend"
          );

          res.status(200).json({
            message: "Заявка отклонена",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};

export const getAllFriends = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const updatedRequest = await getFriendsById(
      Number(userId),
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          res.status(200).json({
            message: "Список друзей получен",
            data: result,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
