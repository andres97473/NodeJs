import express from "express";
import indexRoutes from "./routes/index.routes.js";
import employeesRoutes from "./routes/employees.routes.js";

const app = express();

app.use(express.json());

//rutas
app.use(indexRoutes);
app.use("/api", employeesRoutes);

app.listen(3000);
console.log("Server listening on port 3000");
