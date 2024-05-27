import { Request, Response } from "express";
import { sendMessage, getMessage } from "../service/message.service";

export const sendMessageRequest = async (
  req: Request & any,
  res: Response
): Promise<void> => {
  const { content, receiverId } = req.body;
  const { userId: senderId } = req.params;

  try {
    const newFriendshipRequest = await sendMessage(
      Number(senderId),
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
  const { userId: senderId } = req.params;
  const { receiverId } = req.query;

  console.log("senderId", senderId);
  console.log("receiverId", receiverId);
  console.log(req.query);
  try {
    const newFriendshipRequest = await getMessage(
      Number(senderId),
      Number(receiverId),

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
