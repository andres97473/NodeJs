require("dotenv").config();
const express = require("express");
const server = express();
const cors = require("cors");
const { HomeRoutes, HistoriaRoutes, AuthRoutes } = require("./routes");
const PORT = 3000;

// middleware
server.use(cors());
server.use(express.static("./public"));
server.use(express.json());

// routes
server.use("/", [HomeRoutes, HistoriaRoutes, AuthRoutes]);

// obtener historias desde archivo json, http://localhost:3000/historias

server.listen(PORT, () => {
  console.log(`Application running on PORT ${PORT}`);
});
