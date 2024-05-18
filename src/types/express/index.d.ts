import { Socket } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      io?: string;
    }
  }
}
