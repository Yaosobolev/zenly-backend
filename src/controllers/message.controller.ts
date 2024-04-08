import { Request, Response } from "express";
import { sendMessage, getMessage } from "../service/message.service";

export const sendMessageRequest = async (
  req: Request & any,
  res: Response
): Promise<void> => {
  const { content } = req.body;
  const { userId: receiverId } = req.params;
  const senderId = req.user.id;
  console.log(receiverId);
  try {
    const newFriendshipRequest = await sendMessage(
      senderId,
      Number(receiverId),
      content,
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          res.status(201).json({
            message: "Сообщение отправлено",
            request: result.data.request,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);

    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
export const getMessageRequest = async (
  req: Request & any,
  res: Response
): Promise<void> => {
  const { userId: userToChatId } = req.params;
  const senderId = req.user.id;
  console.log(userToChatId);
  try {
    const newFriendshipRequest = await getMessage(
      senderId,
      Number(userToChatId),

      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          res.status(201).json({
            message: "Сообщение отправлено",
            request: result.data.request,
          });
        }
      }
    );
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);

    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
