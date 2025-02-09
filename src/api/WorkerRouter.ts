import { Router } from "express";
import { getWorkersAPI, getWorkerByIdAPI, createWorkerAPI, updateWorkerAPI, deleteWorkerAPI, turnOnNotificationsAPI, turnOffNotificationsAPI, deactivateWorkerAPI, activateWorkerAPI } from "../controllers/WorkerController";
import { WorkerCreateSchema } from "../schemas/WorkerCreate";
import { bodyValidation } from "../middlewares/Validation";
import { WorkerUpdateSchema } from "../schemas/WorkerUpdate";

const WorkerRouter = Router()

WorkerRouter.get('/', getWorkersAPI)
WorkerRouter.get('/:id', getWorkerByIdAPI)

WorkerRouter.post('/', bodyValidation(WorkerCreateSchema), createWorkerAPI)
WorkerRouter.put('/:id', bodyValidation(WorkerUpdateSchema), updateWorkerAPI)
WorkerRouter.delete('/:id', deleteWorkerAPI)

WorkerRouter.put('/:id/activate', activateWorkerAPI)
WorkerRouter.put('/:id/deactivate', deactivateWorkerAPI)
WorkerRouter.put('/:id/turn-off-notifications', turnOffNotificationsAPI)
WorkerRouter.put('/:id/turn-on-notifications', turnOnNotificationsAPI)

export default WorkerRouter