import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const userClient = new PrismaClient().user;

export const protectRoute = async (
  req: Request & any,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "Не авторизован - отсутсвует токен" });
    }

    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Не авторизован - неверный токен" });
    }

    const user = await userClient.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectedRout middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
