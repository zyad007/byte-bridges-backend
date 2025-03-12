import express from 'express';
import { createContractAPI, deleteContractAPI, getContractAPI, getContractsAPI, updateContractAPI } from '../controllers/ContractsController';
import { bodyValidation, queryValidation } from '../middlewares/Validation';
import { CreateContractSchema } from '../schemas/ContractCreate';
import { ContractSearchSchema } from '../schemas/ContractSearch';

const contractRouter = express.Router();

contractRouter.post('/', bodyValidation(CreateContractSchema), createContractAPI);
contractRouter.get('/', queryValidation(ContractSearchSchema), getContractsAPI);
contractRouter.get('/:id', getContractAPI);
contractRouter.put('/:id', bodyValidation(CreateContractSchema), updateContractAPI);
contractRouter.delete('/:id', deleteContractAPI);

export default contractRouter;

