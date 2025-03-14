import express from 'express';
import { createContractAPI, deleteContractAPI, getContractAPI, getContractsAPI, updateContractAPI } from '../controllers/ContractsController';
import { bodyValidation, queryValidation } from '../middlewares/Validation';
import { CreateContractSchema } from '../schemas/ContractCreate';
import { ContractSearchSchema } from '../schemas/ContractSearch';
import { MilestoneCreateSchema } from '../schemas/MilestoneCreate';
import { addMilestoneAPI, getMilestoneAPI, getMilestonesAPI, updateMilestoneAPI, deleteMilestoneAPI, changeMilestoneStatusAPI } from '../controllers/MilestonesController';
import { MilestoneChangeStatusSchema } from '../schemas/MilestoneChangeStatus';

const contractRouter = express.Router();

// CRUD Contract
contractRouter.post('/', bodyValidation(CreateContractSchema), createContractAPI);
contractRouter.get('/', queryValidation(ContractSearchSchema), getContractsAPI);
contractRouter.get('/:id', getContractAPI);
contractRouter.put('/:id', bodyValidation(CreateContractSchema), updateContractAPI);
contractRouter.delete('/:id', deleteContractAPI);


// CRUD Milestone
contractRouter.post('/:id/milestones', bodyValidation(MilestoneCreateSchema), addMilestoneAPI);
contractRouter.get('/:id/milestones', getMilestonesAPI);
contractRouter.get('/:id/milestones/:milestoneId', getMilestoneAPI);
contractRouter.put('/:id/milestones/:milestoneId', bodyValidation(MilestoneCreateSchema), updateMilestoneAPI);
contractRouter.delete('/:id/milestones/:milestoneId', deleteMilestoneAPI);

// Milestone Actions
contractRouter.put('/:id/milestones/:milestoneId/status', bodyValidation(MilestoneChangeStatusSchema), changeMilestoneStatusAPI);

export default contractRouter;

