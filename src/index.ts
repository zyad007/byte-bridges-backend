import express, { json } from "express";
import { globalErrorHandler } from "./middlewares/handlers/GlobalErrorHandler";
import './db/index'
import UserRouter from "./api/UserRouter";
import WorkerRouter from "./api/WorkerRouter";
import jobsRouter from "./api/JobsRouter";

console.log('ENV:' + process.env.NODE_ENV);

const app = express();
const port = process.env.PORT || 3000;

// JSON Parser Middleware
app.use(json());

// Routers Middleware

app.use('/user', UserRouter);
app.use('/workers', WorkerRouter);
app.use('/test', testRouter);
app.use('/jobs', jobsRouter);

// Error Hadler Middleware
app.use(globalErrorHandler);


app.listen(port, () => {
    console.log('Server listening on port: ' + port);
})