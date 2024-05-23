import { Server } from "socket.io";

const userSocketMap: Record<string, string> = {};

export const getSocketIdByUserId = async (
  userId: string
): Promise<string | null> => {
  console.log("getSocketIdByUserId", userId);
  return userSocketMap[userId] || null;
};

// sendFriendRequestNotification

export const sendSocketToReceiver = async (io, id, result, address) => {
  console.log("sendSocketToReceiver: id", id);
  console.log("sendSocketToReceiver: result", result);
  const socketId = await getSocketIdByUserId(id);
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
    console.log(`hello world! ${socket.id}`);

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

// export const selectSocket = (id, socket) => {
//   return id === socket.handshake.query.userId ? socket.id : null;
// };
