import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

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
        locations: true,
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
      where: { id },
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

export const getFriendsById = async (
  id: number,
  next: NextFunction
): Promise<void> => {
  try {
    const existingUser = await userClient.findUnique({
      where: { id: id },
      include: {
        sentFriendRequests: {
          include: { receiver: true },
          where: { status: "ACCEPTED" },
        },
        receivedFriendRequests: {
          include: { sender: true },
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
      (request) => request.receiver
    );
    const receivedFriends = existingUser.receivedFriendRequests.map(
      (request) => request.sender
    );
    const allFriends = [...sentFriends, ...receivedFriends];

    next({ status: "success", data: { request: allFriends } });
  } catch (error) {
    next(error);
  }
};
