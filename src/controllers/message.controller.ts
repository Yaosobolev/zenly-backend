import { Request, Response } from "express";
import { sendMessage, getMessage } from "../service/message.service";
import { sendSocketToReceiver } from "../socket";
import { io } from "../index";

export const sendMessageRequest = async (
  req: Request & any,
  res: Response
): Promise<void> => {
  const { content, receiverId } = req.body;
  const { userId: senderId } = req.params;

  try {
    const sendMessagepRequest = await sendMessage(
      Number(senderId),
      Number(receiverId),
      content,
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          const {
            data: { request },
          } = result;
          console.log(request);

          sendSocketToReceiver(io, request.receiverId, request, "new-messages");
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

  try {
    const getMessageRequest = await getMessage(
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
