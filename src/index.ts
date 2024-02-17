import express from "express";
import userRouter from "./routes/user.router";
import locationRouter from "./routes/location.router";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/locations", locationRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server up and running on port: ${port}`);
});
