import { Server } from "socket.io";

const userSocketMap: Record<string, string> = {};

export const sendSocketToBothUsers = (
  io,
  senderId,
  receiverId,
  dataForSender,
  dataForReceiver,
  event
) => {
  sendSocketToReceiver(io, senderId, dataForSender, event);
  sendSocketToReceiver(io, receiverId, dataForReceiver, event);
};

export const getSocketIdByUserId = async (
  userId: string
): Promise<string | null> => {
  return userSocketMap[userId] || null;
};

export const sendSocketToReceiver = async (io, id, result, address) => {
  const socketId = await getSocketIdByUserId(id);
  console.log("socketId", socketId);
  if (socketId) {
    io.to(socketId).emit(address, {
      data: result,
    });
  } else {
    console.log(`Нету идентификатора ${id}`);
  }
};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;
    userSocketMap[userId] = socket.id;

    socket.on("disconnect", () => {
      // При отключении пользователя удаляем его из объекта подключенных пользователей
      console.log(`Подключение разорвано: ${socket.id}`);
    });

    socket.emit("connection", { id: userId });
  });

  return io;
};
