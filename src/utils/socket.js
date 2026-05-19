const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const onlineUsers = new Map();

//securing your room Id
const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("-"))
    .digest("hex");
};
const intializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      // we need to made room with unique Id for each conversation
      const roomId = getSecretRoomId({ userId, targetUserId });

      console.log(firstName + " " + "Joining room : ", roomId);
      socket.join(roomId);

      socket.userId = userId;
      socket.roomId = roomId;

      const prevCount = onlineUsers.get(userId) || 0;
      onlineUsers.set(userId, prevCount + 1);

      socket.to(roomId).emit("userOnline", { userId });

      if (onlineUsers.get(targetUserId) > 0) {
          socket.emit("userOnline", { userId: targetUserId });
      }
    });

    //whatever we send over there we recive that here
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId({ userId, targetUserId });

          // authenticate if they are frineds then only send message
          const isFriend = await connectionRequest.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId },
            ],
            status: "accepted",
          });

          if (!isFriend) {
            console.log("Users are not friends");
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text: text,
          });

          await chat.save();

          // whatever message we got from frontend -> we have to emit it to other user
          io.to(roomId).emit("messageRecived", {
            firstName,
            lastName,
            text,
          });
        } catch (error) {
          console.log("error recived while saving message", error.messages);
        }
      },
    );

    socket.on("disconnect", async () => {
        if (socket.userId) {
            const currentCount = onlineUsers.get(socket.userId) || 0;
            if (currentCount > 1) {
                onlineUsers.set(socket.userId, currentCount - 1);
            } else {
                onlineUsers.delete(socket.userId);
                const now = new Date();
                try {
                    await User.findByIdAndUpdate(socket.userId, { lastSeen: now });
                } catch (err) {
                    console.error("Error updating lastSeen:", err);
                }
                if (socket.roomId) {
                    socket.to(socket.roomId).emit("userOffline", { userId: socket.userId, lastSeen: now });
                }
            }
        }
    });
  });
};

module.exports = intializeSocket;
