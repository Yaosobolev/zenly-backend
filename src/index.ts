import express from "express";
import userRouter from "./routes/user.router";
import locationRouter from "./routes/location.router";
import authRouter from "./routes/auth.router";
import friendshipRouter from "./routes/friendship.router";
import messageRouter from "./routes/message.router";
import cookieParser from "cookie-parser";
import cors from "cors";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.options("*", cors());

app.use(cookieParser());
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/locations", locationRouter);
app.use("/api/auth", authRouter);
app.use("/api/friendship", friendshipRouter);
app.use("/api/messages", messageRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});
