import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";
import { generateAccessTokenAndSetCookie } from "../utils/generateToken";

const userClient = new PrismaClient().user;

export const protectRoute = async (
  req: Request & any,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

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

    if (!accessToken) {
      generateAccessTokenAndSetCookie(decoded.userId, decoded.username, res);
    }
    if (!req.params.userId) {
      return res.json({
        message: "Данные пользователя получены",
        id: user.id,
        username: user.username,
      });
    }

    if (decoded.userId !== Number(req.params.userId)) {
      return res.status(403).json({ error: "Доступ запрещен", id: user.id });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectedRout middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// postgres://zenly_user:8dLMvpaoi2s32t3eRzh7lZFEMuzOoK3G@dpg-cp312e21hbls7386sn80-a/zenlydb2
// postgres://zenly_user:8dLMvpaoi2s32t3eRzh7lZFEMuzOoK3G@dpg-cp312e21hbls7386sn80-a.oregon-postgres.render.com/zenlydb2
