import express from "express";
import indexRoutes from "./routes/index.routes.js";
import employeesRoutes from "./routes/employees.routes.js";
import { PORT } from "./config.js";

const app = express();

// Carpeta publica
app.use(express.static("public"));

app.use(express.json());

//rutas
app.use(indexRoutes);
app.use("/api", employeesRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.listen(PORT);
console.log("Server listening on Port", PORT);
