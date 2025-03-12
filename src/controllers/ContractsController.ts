import { NextFunction, Request, Response } from "express";
import { createContract, deleteContract, getContract, getContracts, updateContract } from "../services/ContractServices";
import { CreateContractType } from "../schemas/ContractCreate";
import { Result } from "../dto/Result";
import { ContractSearchType } from "../schemas/ContractSearch";
import { ContractType, ContractStatus } from "../enum/Contracts";

export const createContractAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const contract = req.body as CreateContractType;
        console.log(contract);

        // Ensure dates are proper Date objects
        const startDate = contract.startDate instanceof Date ?
            contract.startDate : new Date();

        const deadline = contract.deadline instanceof Date ?
            contract.deadline : (contract.deadline ? new Date(contract.deadline) : null);

        const nextDeadline = contract.nextDeadline instanceof Date ?
            contract.nextDeadline : (contract.nextDeadline ? new Date(contract.nextDeadline) : null);

        const newContract = await createContract({
            ownerName: contract.ownerName,
            ownerEmail: contract.ownerEmail,
            ownerPhone: contract.ownerPhone,
            title: contract.title,
            description: contract.description,
            type: contract.type ?? ContractType.FIXED,
            startDate: startDate,
            deadline: deadline,
            nextDeadline: nextDeadline,
            total: contract.total,
            status: contract.status ?? ContractStatus.PENDING,

            progress: 0,
            paid: contract.paid ?? 0
        });

        return res.status(201).json(new Result({
            data: newContract,
            status: true,
            message: 'Contract created successfully'
        }));
    } catch (error) {
        return next(error);
    }
};

export const getContractsAPI = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    try {
        const query = req.query as ContractSearchType;

        console.log(query);

        let sort: {
            field: 'total' | 'paid' | 'progress' | 'deadline' | 'nextDeadline' | 'startDate',
            order: 'asc' | 'desc'
        } | undefined;

        if (query.sortBy) {
            sort = {
                field: query.sortBy as 'total' | 'paid' | 'progress' | 'deadline' | 'nextDeadline' | 'startDate',
                order: query.order as 'asc' | 'desc'
            }
        }

        const contracts = await getContracts({
            page: query.page,
            limit: query.limit,
            search: query.search,
            status: query.status,
            type: query.type,
            sort: sort
        });
        return res.status(200).json(contracts);
    } catch (error) {
        return next(error);
    }
};

export const getContractAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is required'
            }));
        }

        if (isNaN(Number(id))) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is not a number'
            }));
        }

        const contract = await getContract(Number(id));

        return res.status(200).json(new Result({
            data: contract,
            status: true,
            message: 'Contract fetched successfully'
        }));

    } catch (error) {
        return next(error);
    }
}

export const updateContractAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is required'
            }));
        }

        if (isNaN(Number(id))) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is not a number'
            }));
        }

        const contract = req.body as CreateContractType;
        console.log(contract);

        // Ensure dates are proper Date objects
        const startDate = contract.startDate instanceof Date ?
            contract.startDate : new Date();

        const deadline = contract.deadline instanceof Date ?
            contract.deadline : (contract.deadline ? new Date(contract.deadline) : null);

        const nextDeadline = contract.nextDeadline instanceof Date ?
            contract.nextDeadline : (contract.nextDeadline ? new Date(contract.nextDeadline) : null);

        const updatedContract = await updateContract(Number(id), {
            ownerName: contract.ownerName,
            ownerEmail: contract.ownerEmail,
            ownerPhone: contract.ownerPhone,
            title: contract.title,
            description: contract.description,
            type: contract.type ?? ContractType.FIXED,
            startDate: startDate,
            deadline: deadline,
            nextDeadline: nextDeadline,
            total: contract.total,
            status: contract.status ?? ContractStatus.PENDING,

            progress: 0,
            paid: contract.paid ?? 0
        });

        return res.status(200).json(new Result({
            data: updatedContract,
            status: true,
            message: 'Contract updated successfully'
        }));
    } catch (error) {
        return next(error);
    }
};

export const deleteContractAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is required'
            }));
        }

        if (isNaN(Number(id))) {
            return res.status(400).json(new Result({
                status: false,
                message: 'Contract ID is not a number'
            }));
        }

        await deleteContract(Number(id));

        return res.status(200).json(new Result({
            status: true,
            message: 'Contract deleted successfully'
        }));
    } catch (error) {
        return next(error);
    }
}