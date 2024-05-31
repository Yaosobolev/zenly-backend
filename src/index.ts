import express from "express";
// import userRouter from "./routes/user.router";
import locationRouter from "./routes/location.router";
import authRouter from "./routes/auth.router";
import friendshipRouter from "./routes/friendship.router";
import messageRouter from "./routes/message.router";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import { errorMiddleware } from "./middleware/error.middleware";

import { initSocket } from "./socket";
// import { ioMiddleware } from "./middleware/io.middleware";
import { CLIENT_RENEG_LIMIT } from "tls";

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
export const io = initSocket(server);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    // origin: "*",
    credentials: true,
  })
);

app.options("*", cors());
app.use(cookieParser());
app.use(express.json());
app.use(errorMiddleware);
// app.use(ioMiddleware(io));

app.use("/api/locations", locationRouter);
app.use("/api/auth", authRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/messages", messageRouter);

app.get("/", (req, res) => {
  const clientIP = req.ip;
  res.send(`Hello World ${clientIP}`);
});

server.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});
