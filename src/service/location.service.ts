import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";

const locationClient = new PrismaClient().location;

export const setLocation = async (
  latitude: number,
  longitude: number,
  userId: number,
  next: NextFunction
): Promise<void> => {
  try {
    let existingLocation = await locationClient.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!existingLocation) {
      // Если записи о местоположении пользователя не существует, создаем новую
      existingLocation = await locationClient.create({
        data: {
          latitude,
          longitude,
          userId,
        },
      });
    } else {
      // Если запись о местоположении пользователя уже существует, обновляем ее
      existingLocation = await locationClient.update({
        where: {
          userId: userId,
        },
        data: {
          latitude,
          longitude,
        },
      });
    }

    const locationWithUser = await locationClient.findUnique({
      where: { id: existingLocation.id },
      select: {
        latitude: true,
        longitude: true,
        user: {
          select: {
            sentFriendRequests: {
              where: {
                status: "ACCEPTED",
              },
              select: {
                receiverId: true,
              },
            },
            receivedFriendRequests: {
              where: {
                status: "ACCEPTED",
              },
              select: {
                senderId: true,
              },
            },
            username: true,
            id: true,
          },
        },
      },
    });
    next({ status: "success", data: locationWithUser });
  } catch (error) {
    next(error);
  }
};

export const getLocation = async (
  userId: number,
  next: NextFunction
): Promise<void> => {
  const convertToNumber = Number(userId);
  try {
    const location = await locationClient.findUnique({
      where: {
        userId: convertToNumber,
      },
      select: {
        user: {
          select: {
            sentFriendRequests: {
              where: {
                status: "ACCEPTED",
              },
              select: {
                receiver: {
                  select: {
                    id: true,
                    username: true,
                    location: {
                      select: {
                        latitude: true,
                        longitude: true,
                      },
                    },
                  },
                },
              },
            },
            receivedFriendRequests: {
              where: {
                status: "ACCEPTED",
              },
              select: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    location: {
                      select: {
                        latitude: true,
                        longitude: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!location) {
      const error = new Error(`Локация не найдена`);
      error["statusCode"] = 404;
      throw error;
    }

    next({ status: "success", data: location });
  } catch (error) {
    next(error);
  }
};
