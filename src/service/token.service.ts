import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const refreshToken = async (
  refreshToken: string,
  next: NextFunction
): Promise<void> => {
  try {
    if (!refreshToken) {
      const error = new Error("Требуется токен обновления");
      error["statusCode"] = 401;
      throw error;
    }

    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);

    next({ status: "success", data: { user: decoded.userId } });
  } catch (error) {
    next(error);
  }
};
