import express from "express";
import morgan from "morgan";
import cors from "cors";
import 'reflect-metadata';
import { createConnection } from "typeorm";

import userRoutes from './routes/user.routes';

// servidor es app
const app = express();
createConnection();

// Middlewares funciones antes de que se ejecuten las rutas
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use(userRoutes);

// Puerto
const PORT = 3000;

app.listen(PORT);
console.log('Server on port ', PORT);
