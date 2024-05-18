import { Request, Response } from "express";

import { Request as ExpressRequest } from "express";
import { Server } from "socket.io";

// Define a custom interface that extends the Express request interface

import {
  createFriendRequest,
  processFriendRequest,
} from "../service/friendship.service";
import { getFriendsById } from "../service/user.service";

interface CustomRequest extends ExpressRequest {
  io: Server; // Add the 'io' property of type Server
}

export const sendFriendRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { senderId, receiverId } = req.body;

  // const io= req.io;
  const io = req.io;

  console.log(io);
  try {
    const newFriendshipRequest = await createFriendRequest(
      senderId,
      receiverId,
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          io.emit("friend-request", { senderId });
          res.status(201).json({
            message: "Заявка отправлена",
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

// export const sendFriendRequest = async (
//   socket: Socket,
//   data: any
// ): Promise<void> => {
//   const { senderId, receiverId } = data;
//   try {
//     // Отправка запроса о дружбе
//     const newFriendshipRequest = await createFriendRequest(
//       senderId,
//       receiverId,
//       (result: any) => {
//         if (result instanceof Error) {
//           throw result;
//         } else {
//           result.json({
//             message: "Заявка отправлена",
//             request: result.data.request,
//           });
//         }
//       }
//     );
//     // Отправка сообщения о новом запросе всем подключенным клиентам
//     socket.emit("friendRequest", { senderId, receiverId });
//   } catch (error) {
//     console.error("Ошибка отправки заявки:", error);
//     // Обработка ошибки
//   }
// };

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
