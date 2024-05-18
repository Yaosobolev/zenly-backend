import { Request, Response, NextFunction } from "express";

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Все поля обязательны для заполнения" });
  }

  if (password.length < 2) {
    return res
      .status(400)
      .json({ error: "Пароль должен содержать не менее 2 знаков" });
  }

  next();
};
export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Все поля обязательны для заполнения" });
  }

  next();
};

// export const isAuthenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const tokenAccess = req.cookies.accessToken;
//   const refreshToken = req.cookies.refreshToken;

//   if (!refreshToken) {
//     return res.status(401).json({ message: "Требуется аутентификация" });
//   }

//   next();
// };
