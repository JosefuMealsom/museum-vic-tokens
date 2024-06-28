import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(express.static("public"));

io.on("connection", (client) => {
  // Is it possible to relay this message directly to the client
  client.on("tokens_detected:app", (data) => {
    io.emit("tokens_detected:app", data);
  });

  client.on("disconnect", () => {});
});

const port = 5000;
console.info(`Server listening on port ${port}`);
server.listen(port);
