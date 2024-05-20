import { Request, Response } from "express";

import {
  createFriendRequest,
  processFriendRequest,
} from "../service/friendship.service";
import { getFriendsById, getFriendRequests } from "../service/user.service";
import { io } from "../index";
import { sendFriendRequestNotification } from "../socket";

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
          sendFriendRequestNotification(io, receiverId, result);

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
          res.status(200).json({
            message: "Заявка принята",
            request: result.data.request,
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
          res.status(200).json({
            message: "Заявка отклонена",
            request: result.data.request,
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
  const { id } = req.body;
  try {
    const updatedRequest = await getFriendsById(id, (result: any) => {
      if (result instanceof Error) {
        throw result;
      } else {
        res.status(200).json({
          message: "Список друзей получен",
          request: result.data.request,
        });
      }
    });
  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
