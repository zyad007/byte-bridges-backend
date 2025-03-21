import dotenv from 'dotenv'
dotenv.config()

import express, { json } from "express";
import { globalErrorHandler } from "./middlewares/handlers/GlobalErrorHandler";
import './db/index'
import UserRouter from "./api/UserRouter";
import WorkerRouter from "./api/WorkerRouter";
import jobsRouter from "./api/JobsRouter";
import { auth } from "./middlewares/Auth";
import { initializeSocket } from './socket.client';
import cors from 'cors';
import contractRouter from './api/ContractsRouter';
console.log('ENV:' + process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 3000;

// Initialize socket connection
const socket = initializeSocket();

// JSON Parser Middleware
app.use(json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
}));
// Routers Middleware

app.use('/user', UserRouter);
app.use('/workers', auth, WorkerRouter);
app.use('/jobs', auth, jobsRouter);
app.use('/contracts', auth, contractRouter);

// Error Hadler Middleware
app.use(globalErrorHandler);


app.listen(port, () => {
    console.log('Server listening on port: ' + port);
})

export { app };
