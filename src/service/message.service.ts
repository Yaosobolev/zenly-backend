import { NextFunction } from "express";
import { getUserById } from "./user.service";
import { PrismaClient, User } from "@prisma/client";

const messageClient = new PrismaClient().message;

export const sendMessage = async (
  senderId: number,
  receiverId: number,
  content: string,
  next: NextFunction
): Promise<void> => {
  try {
    // проверка на существование пользователей
    const sender = await getUserById(senderId);

    const receiver = await getUserById(receiverId);

    if (senderId === receiverId) {
      const error = new Error("Нельзя писать самому себя");
      error["statusCode"] = 400;
      throw error;
    }

    const newMessage = await messageClient.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
    });

    next({ status: "success", data: { request: newMessage } });
  } catch (error) {
    next(error);
  }
};
export const getMessage = async (
  senderId: number,
  receiverId: number,
  next: NextFunction
): Promise<void> => {
  try {
    const message = await messageClient.findMany({
      where: {
        OR: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      include: {
        sender: { select: { username: true, id: true } },
        receiver: { select: { username: true, id: true } },
      },
    });

    next({ status: "success", data: { request: message } });
  } catch (error) {
    next(error);
  }
};
