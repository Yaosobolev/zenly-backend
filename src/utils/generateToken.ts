import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateAccessTokenAndSetCookie = (
  userId: number,
  res: Response
) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("accessToken", accessToken, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export const generateRefreshTokenAndSetCookie = (
  userId: number,
  res: Response
) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};
