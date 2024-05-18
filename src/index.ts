import express from "express";
import userRouter from "./routes/user.router";
import locationRouter from "./routes/location.router";
import authRouter from "./routes/auth.router";
import friendshipRouter from "./routes/friendship.router";
import messageRouter from "./routes/message.router";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

import { errorMiddleware } from "./middleware/error.middleware";

const initSocket = require("./socket.ts");
const ioMiddleware = require("./middleware/io.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: "*",
    credentials: true,
  })
);

app.options("*", cors());

app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(errorMiddleware);

app.use(ioMiddleware(io));

// app.use(ioMiddleware(io));

app.use("/api/users", userRouter);
app.use("/api/locations", locationRouter);
app.use("/api/auth", authRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/messages", messageRouter);

// io.on("connection", (socket: Socket) => {
//   console.log("Новое соединение");

//   socket.on(
//     "friendRequest",
//     ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
//       try {
//         // Обработка запроса
//         io.emit("friendRequest", { senderId, receiverId }); // Отправка ответа всем клиентам
//       } catch (error) {
//         console.error("Ошибка отправки заявки:", error);
//       }
//     }
//   );
// });

// io.on("connection", (socket) => {
//   console.log("Client connected");

//   // Обработчик для новой заявки в друзья
//   socket.on("newFriendRequest", (request) => {
//     // Отправляем уведомление всем подключенным клиентам о новой заявке в друзья
//     io.emit("friendRequest", request);
//   });

//   // Обработчик для отключения клиента
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

// io.on("connection", (socket) => {
//   console.log("Новое соединение с сокетом", socket.id);

// Обработка событий сокета
// socket.on("friendRequest", (data) => {
//   console.log("Получено новое сообщение от клиента:", data);

//   // Отправить ответное сообщение обратно клиенту
//   socket.emit("friendRequest", { message: "Привет, клиент!" });
// });
// });

app.get("/", (req, res) => {
  const clientIP = req.ip;
  res.send(`Hello World ${clientIP}`);
});

server.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});
