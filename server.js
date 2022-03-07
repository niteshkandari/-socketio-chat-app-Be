require("dotenv").config();
const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
const port = process.env.PORT || 8000;

const users = {};

io.on("connection", (socket) => {
  
    socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

  socket.on("send", (payload) => {
    io.emit("recieve", {
      message: payload.message,
      time: payload.time,
      name: users[socket.id],
    }); 
  });

});

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
