import app from "./app";
import { Server as WebsocketServer } from "socket.io";
import http from "http";
import sockets from "./sockets";

import { connectDB } from "./db";

connectDB();

// convertir app en servidor http
const server = http.createServer(app);
const httpServer = server.listen(3000);
console.log("server is running on port 3000");

// io es la coneccion que tengo con mis multiples clientes
const io = new WebsocketServer(httpServer);
sockets(io);
