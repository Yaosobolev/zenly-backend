import { FriendshipStatus, PrismaClient } from "@prisma/client";
import { NextFunction } from "express";
import { getUserById } from "./user.service";

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
          id: userId,
        },
        data: {
          latitude,
          longitude,
        },
      });
    }
    next({ status: "success", data: { request: existingLocation } });
  } catch (error) {
    next(error);
  }
};

export const getLocation = async (
  userId: number,
  next: NextFunction
): Promise<void> => {
  try {
    const location = await locationClient.findUnique({
      where: {
        id: userId,
      },
    });

    if (!location) {
      const error = new Error(`Локация не найдена`);
      error["statusCode"] = 404;
      throw error;
    }

    next({ status: "success", data: { request: location } });
  } catch (error) {
    next(error);
  }
};
