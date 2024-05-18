import { Socket } from "socket.io";

// declare module "express-serve-static-core" {
//   interface Request {
//     io: Socket; // Здесь указывайте тип объекта для вашего сокета
//   }
// }

// import { Request } from "express";
// export interface IGetUserAuthInfoRequest extends Request {
//   io: Socket; // or any other type
// }

import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      io: any;
    }
  }
}
