import { Request, Response } from "express";
import { createUser, getUserByUsername } from "../service/user.service";
import {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
} from "../utils/generateToken";

import { refreshToken } from "../service/token.service";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password, (result: any) => {
      if (result instanceof Error) {
        throw result;
      } else {
        generateAccessTokenAndSetCookie(
          result.data.user.id,
          result.data.user.username,
          res
        );
        generateRefreshTokenAndSetCookie(
          result.data.user.id,
          result.data.user.username,
          res
        );
        res.status(201).json({
          message: "Пользователь успешно зарегистрирован",
          user: result.data.user,
        });
      }
    });
  } catch (error) {
    console.error("Ошибка регистрации пользователя:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username, password, (result: any) => {
      if (result instanceof Error) {
        throw result;
      } else {
        generateAccessTokenAndSetCookie(
          result.data.user.id,
          result.data.user.username,
          res
        );
        generateRefreshTokenAndSetCookie(
          result.data.user.id,
          result.data.user.username,
          res
        );
        console.log(result.data.user.username);
        res.status(200).json({
          message: "Пользователь успешно авторизировался",
          id: result.data.user.id,
          username: result.data.user.username,
          locations: result.data.user.locations,
        });
      }
    });
  } catch (error) {
    console.error("Ошибка авторизации пользователя:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.cookie("accessToken", "", { maxAge: 0 });
    res.status(200).json({ message: "Пользователь успешно вышел из аккаунта" });
  } catch (error) {
    console.error("Ошибка выхода из системы:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshTokenFromCookie = req.cookies["refreshToken"];
    const refreshTokens = await refreshToken(
      refreshTokenFromCookie,
      (result: any) => {
        if (result instanceof Error) {
          throw result;
        } else {
          generateAccessTokenAndSetCookie(
            result.data.user,
            result.data.user.username,
            res
          );
          res.status(200).json(result);
        }
      }
    );
  } catch (error) {
    console.error("Ошибка обновления токена:", error);
    const statusCode = error.statusCode || 500;
    res
      .status(statusCode)
      .json({ message: error.message || "Внутренняя ошибка сервера" });
  }
};
