import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextFunction } from "express";

const userClient = new PrismaClient().user;

export const createUser = async (
  username: string,
  password: string,
  next: NextFunction
): Promise<void> => {
  try {
    const existingUser = await userClient.findUnique({
      where: { username },
    });

    if (existingUser) {
      const error = new Error("Пользователь с таким именем уже существует");
      error["statusCode"] = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userClient.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    next({ status: "success", data: { user: newUser } });
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (
  username: string,
  password: string,
  next: NextFunction
): Promise<void> => {
  try {
    const existingUser = await userClient.findUnique({
      where: { username },
      include: {
        location: true,
      },
    });

    if (!existingUser) {
      const error = new Error("Пользователь с таким именем не существует");
      error["statusCode"] = 409;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      const error = new Error("Неверный пароль");
      error["statusCode"] = 401;
      throw error;
    }

    next({ status: "success", data: { user: existingUser } });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (id: number) => {
  try {
    const existingUser = await userClient.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      const error = new Error(`Пользователь с ${id} идентификатором не найден`);
      error["statusCode"] = 404;
      throw error;
    }

    return existingUser;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (id: number, next: NextFunction) => {
  try {
    const existingUser = await userClient.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      const error = new Error(`Пользователь с ${id} идентификатором не найден`);
      error["statusCode"] = 404;
      throw error;
    }

    next({ status: "success", data: { user: existingUser } });
  } catch (error) {
    throw error;
  }
};

export const getFriendsById = async (
  id: number,
  next: NextFunction
): Promise<void> => {
  try {
    const existingUser = await userClient.findUnique({
      where: { id: id },
      include: {
        sentFriendRequests: {
          select: {
            id: true,
            receiver: {
              select: {
                id: true,
                username: true,
                location: { select: { latitude: true, longitude: true } },
              },
            },
          },
          where: { status: "ACCEPTED" },
        },
        receivedFriendRequests: {
          select: {
            id: true,

            sender: {
              select: {
                id: true,
                username: true,
                location: { select: { latitude: true, longitude: true } },
              },
            },
          },
          where: { status: "ACCEPTED" },
        },
      },
    });

    if (!existingUser) {
      const error = new Error(`Пользователь с ${id} идентификатором не найден`);
      error["statusCode"] = 404;
      throw error;
    }

    const sentFriends = existingUser.sentFriendRequests.map(
      (request) => request
    );
    const receivedFriends = existingUser.receivedFriendRequests.map(
      (request) => request
    );
    const allFriends = [...sentFriends, ...receivedFriends];

    next(allFriends);
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (
  id: number,
  next: NextFunction
): Promise<void> => {
  try {
    const existingUser = await userClient.findUnique({
      where: { id: id },
      select: {
        receivedFriendRequests: {
          select: {
            id: true,
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          where: {
            status: "PENDING",
          },
        },
      },
    });

    if (!existingUser) {
      const error = new Error(`Пользователь с ${id} идентификатором не найден`);
      error["statusCode"] = 404;
      throw error;
    }

    next(existingUser.receivedFriendRequests);
  } catch (error) {
    next(error);
  }
};
