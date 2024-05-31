import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { setLocation, getLocation } from "../service/location.service";
import { sendSocketToReceiver } from "../socket";
import { io } from "../index";

const locationClient = new PrismaClient().location;

export const setLocationRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { latitude, longitude } = req.body;
  const { userId } = req.params;
  try {
    const location = await setLocation(
      latitude,
      longitude,
      Number(userId),
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          const { data } = result;

          const receivers = [
            ...data.user.sentFriendRequests,
            ...data.user.receivedFriendRequests,
          ].map((item) => item.receiverId || item.senderId);

          const dataForReceiver = {
            latitude: data.latitude,
            longitude: data.longitude,
            usename: data.user.username,
            id: data.user.id,
          };

          receivers.forEach((receiver) => {
            sendSocketToReceiver(io, receiver, dataForReceiver, "friend-geo");
          });

          res.status(201).json({
            message: "Координаты установлены",
            request: result.data,
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
export const getLocationRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const location = await getLocation(Number(userId), (result: any) => {
      if (result instanceof Error) {
        throw result;
      } else {
        const {
          data: { user },
        } = result;

        // const friends = [
        //   ...user.sentFriendRequests.map((item) => ({ data: item.receiver })),
        //   ...user.receivedFriendRequests.map((item) => ({
        //     data: item.sender,
        //   })),
        // ];

        const friends = [
          ...user.sentFriendRequests.map((item) => ({
            data: {
              id: item.receiver.id,
              username: item.receiver.username,
              latitude: item.receiver.location?.latitude,
              longitude: item.receiver.location?.longitude,
            },
          })),
          ...user.receivedFriendRequests.map((item) => ({
            data: {
              id: item.sender.id,
              username: item.sender.username,
              latitude: item.sender.location?.latitude,
              longitude: item.sender.location?.longitude,
            },
          })),
        ];
        console.log(friends);
        res.status(200).json({
          request: friends,
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
