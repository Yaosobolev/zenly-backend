import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { setLocation, getLocation } from "../service/location.service";
import { sendSocketToReceiver } from "../socket";
import { io } from "../index";

const locationClient = new PrismaClient().location;

//getAllLocations
// export const getAllLocations = async (req, res) => {
//   try {
//     const allLocations = await locationClient.findMany();

//     res.status(200).json({ data: allLocations });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //getLocationById
// export const getLocationById = async (req, res) => {
//   try {
//     const locationId = Number(req.params.id);
//     const location = await locationClient.findUnique({
//       where: {
//         id: locationId,
//       },
//     });

//     res.status(200).json({ data: location });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //createLocation
// export const createLocation = async (req, res) => {
//   try {
//     const locationData = req.body;
//     const location = await locationClient.create({
//       data: {
//         latitude: locationData.latitude,
//         longitude: locationData.longitude,
//         user: {
//           connect: { id: locationData.userId },
//         },
//       },
//     });

//     res.status(201).json({ data: location });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //updateLocation
// export const updateLocation = async (req, res) => {
//   try {
//     const locationId = Number(req.params.id);
//     const locationData = req.body;
//     const location = await locationClient.update({
//       where: {
//         id: locationId,
//       },
//       data: locationData,
//     });

//     res.status(200).json({ data: location });
//   } catch (error) {
//     console.log(error);
//   }
// };

// //deleteLocation
// export const deleteLocation = async (req, res) => {
//   try {
//     const locationId = Number(req.params.id);
//     const location = await locationClient.delete({
//       where: {
//         id: locationId,
//       },
//     });

//     res.status(200).json({ messsage: "successfully" });
//   } catch (error) {
//     console.log(error);
//   }
// };

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
        res.status(200).json({
          message: "Координаты получены",
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
