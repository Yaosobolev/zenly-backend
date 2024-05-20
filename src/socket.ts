import { Server } from "socket.io";

const userSocketMap: Record<string, string> = {};

export const getSocketIdByUserId = async (
  userId: string
): Promise<string | null> => {
  return userSocketMap[userId] || null;
};

export const sendFriendRequestNotification = async (io, receiverId, result) => {
  const socketId = await getSocketIdByUserId(receiverId);
  if (socketId) {
    io.to(socketId).emit("friend-requests", {
      data: result,
    });
  } else {
    console.log(`Нету идентификатора ${receiverId}`);
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
