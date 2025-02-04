import { Router } from "express";
import { getWorkersAPI, getWorkerByIdAPI, createWorkerAPI, updateWorkerAPI, deleteWorkerAPI } from "../controllers/WorkerController";
import { UpdateWorkerSchema } from "../schemas/UpdateWorker";
import { CreateWorkerSchema } from "../schemas/CreateWorker";
import { bodyValidation } from "../middlewares/Validation";

const WorkerRouter = Router()


WorkerRouter.get('/', getWorkersAPI)

WorkerRouter.get('/:id', getWorkerByIdAPI)

WorkerRouter.post('/', bodyValidation(CreateWorkerSchema), createWorkerAPI)

WorkerRouter.put('/:id', bodyValidation(UpdateWorkerSchema), updateWorkerAPI)

WorkerRouter.delete('/:id', deleteWorkerAPI)

export default WorkerRouter