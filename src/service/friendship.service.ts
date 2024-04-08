import { FriendshipStatus, PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { getUserById } from "./user.service";

const friendshipClient = new PrismaClient().friendship;

export const checkExistingFriendRequest = async (
  senderId: number,
  receiverId: number
) => {
  try {
    const existingRequest = await friendshipClient.findFirst({
      where: {
        AND: [
          { senderId },
          { receiverId },
          {
            OR: [
              { status: "PENDING" },
              { status: "ACCEPTED" }, // Добавляем проверку для статуса "ACCEPTED"
            ],
          },
        ],
      },
    });

    if (existingRequest !== null) {
      const error = new Error(`Повторная отправка запроса в друзья`);
      error["statusCode"] = 429;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

export const createFriendRequest = async (
  senderId: number,
  receiverId: number,
  next: NextFunction
): Promise<void> => {
  try {
    // проверка на существование пользователей
    const sender = await getUserById(senderId);
    const receiver = await getUserById(receiverId);

    const checkFriendRequest = await checkExistingFriendRequest(
      senderId,
      receiverId
    );
    const checkFriendRequestReverse = await checkExistingFriendRequest(
      receiverId,
      senderId
    );
    if (senderId === receiverId) {
      const error = new Error("Нельзя добавить самого себя в друзья");
      error["statusCode"] = 400;
      throw error;
    }
    const newFriendshipRequest = await friendshipClient.create({
      data: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });
    next({ status: "success", data: { request: newFriendshipRequest } });
  } catch (error) {
    next(error);
  }
};

export const processFriendRequest = async (
  requestId: number,
  status: string,
  next: NextFunction
): Promise<void> => {
  try {
    const friendshipRequest = await friendshipClient.findUnique({
      where: { id: requestId },
    });

    if (!friendshipRequest) {
      const error = new Error("Запрос на установление дружбы не найден");
      error["statusCode"] = 400;
      throw error;
    }
    const updatedFriendshipRequest = await friendshipClient.update({
      where: { id: requestId },
      data: { status: status as FriendshipStatus },
    });
    next({ status: "success", data: { request: updatedFriendshipRequest } });
  } catch (error) {
    next(error);
  }
};