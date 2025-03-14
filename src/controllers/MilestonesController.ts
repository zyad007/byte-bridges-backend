import { NextFunction, Request, Response } from "express";
import { createMilestone, deleteMilestone, getContract, getMilestone, getMilestones, updateContract, updateMilestone } from "../services/ContractServices";
import { MilestoneStatus } from "../enum/Contracts";
import { CreateMilestoneType } from "../schemas/MilestoneCreate";
import { Result } from "../dto/Result";
import { ChangeMilestoneStatusType } from "../schemas/MilestoneChangeStatus";

// CRUD
export const addMilestoneAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id: contractId } = req.params;
        const newMilestone = req.body as CreateMilestoneType;

        const dueDate = newMilestone.dueDate instanceof Date ? newMilestone.dueDate : null;


        if (!contractId) {
            return res.status(400).json({
                message: "Contract ID is required"
            });
        }

        if (isNaN(Number(contractId))) {
            return res.status(400).json({
                message: "Contract ID must be a number"
            });
        }


        const contract = await getContract(Number(contractId));

        const milestoneStatus = contract.milestones.filter(m => m.status !== MilestoneStatus.CANCELLED).length > 0 ? MilestoneStatus.PENDING : MilestoneStatus.IN_PROGRESS;

        await createMilestone(Number(contractId), {
            contractId: contract.id,
            status: milestoneStatus,
            amount: newMilestone.amount ?? 0,
            description: newMilestone.description ?? "",
            title: newMilestone.title ?? "",
            dueDate: dueDate ?? undefined,
        });


        const oldMilestonesCount = contract.milestones.filter(m => m.status !== MilestoneStatus.CANCELLED).length;
        const oldProgress = contract.progress ?? 0;

        const newProgress = Math.round(oldProgress * (oldMilestonesCount / (oldMilestonesCount + 1)));

        console.log('oldMilestonesCount', oldMilestonesCount);
        console.log('oldProgress', oldProgress);
        console.log('newProgress', newProgress);

        if (contract.milestones.length > 0) {
            await updateContract(Number(contractId), {
                progress: calculateProgress(
                    contract.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length,
                    contract.milestones.filter(m => m.status !== MilestoneStatus.CANCELLED).length + 1)
            })
        }

        const newContract = await getContract(Number(contractId));

        return res.status(201).json(new Result({
            message: "Milestone created successfully",
            data: newContract,
            status: true
        }));

    } catch (error) {
        next(error);
    }
}

export const getMilestonesAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id: contractId } = req.params;

        if (!contractId) {
            return res.status(400).json({
                message: "Contract ID is required"
            });
        }

        if (isNaN(Number(contractId))) {
            return res.status(400).json({
                message: "Contract ID must be a number"
            });
        }

        const contract = await getContract(Number(contractId));

        const milestones = await getMilestones(contract.id);

        return res.status(200).json(new Result({
            message: "Milestones fetched successfully",
            data: milestones,
            status: true
        }));

    } catch (error) {
        next(error);
    }
}

export const getMilestoneAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id: contractId, milestoneId } = req.params;

        if (!contractId || !milestoneId) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID are required"
            });
        }

        if (isNaN(Number(contractId)) || isNaN(Number(milestoneId))) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID must be numbers"
            });
        }

        const contract = await getContract(Number(contractId));

        const milestone = await getMilestone(Number(milestoneId));

        return res.status(200).json(new Result({
            message: "Milestone fetched successfully",
            data: milestone,
            status: true
        }));

    } catch (error) {
        next(error);
    }
}

export const updateMilestoneAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id: contractId, milestoneId } = req.params;
        const updatedMilestone = req.body as CreateMilestoneType;

        if (!contractId || !milestoneId) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID are required"
            });
        }

        if (isNaN(Number(contractId)) || isNaN(Number(milestoneId))) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID must be numbers"
            });
        }

        const contract = await getContract(Number(contractId));

        const dueDate = updatedMilestone.dueDate instanceof Date ? updatedMilestone.dueDate : (updatedMilestone.dueDate ? new Date(updatedMilestone.dueDate) : null);

        const oldMilestone = await getMilestone(Number(milestoneId));

        const milestone = await updateMilestone(Number(milestoneId), {
            title: updatedMilestone.title ?? oldMilestone.title,
            description: updatedMilestone.description ?? oldMilestone.description,
            amount: updatedMilestone.amount ?? oldMilestone.amount,
            dueDate: dueDate ?? oldMilestone.dueDate
        });

        return res.status(200).json(new Result({
            message: "Milestone updated successfully",
            data: milestone,
            status: true
        }));

    } catch (error) {
        next(error);
    }
}

export const deleteMilestoneAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id: contractId, milestoneId } = req.params;

        if (!contractId || !milestoneId) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID are required"
            });
        }

        if (isNaN(Number(contractId)) || isNaN(Number(milestoneId))) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID must be numbers"
            });
        }

        const contract = await getContract(Number(contractId));

        const milestone = await getMilestone(Number(milestoneId));

        await deleteMilestone(Number(milestoneId));

        const newContract = await getContract(Number(contractId));

        await updateContract(Number(contractId), {
            progress: calculateProgress(
                newContract.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length,
                newContract.milestones.filter(m => m.status !== MilestoneStatus.CANCELLED).length),
            paid: (contract.paid ?? 0) - (milestone.amount ?? 0)
        })

        return res.status(200).json(new Result({
            message: "Milestone deleted successfully",
            status: true
        }));

    } catch (error) {
        next(error);
    }
}

// Actions
export const changeMilestoneStatusAPI = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { id: contractId, milestoneId } = req.params;
        const { status } = req.body as ChangeMilestoneStatusType;

        if (!contractId || !milestoneId) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID are required"
            });
        }

        if (isNaN(Number(contractId)) || isNaN(Number(milestoneId))) {
            return res.status(400).json({
                message: "Contract ID and Milestone ID must be numbers"
            });
        }

        const contract = await getContract(Number(contractId));

        const milestone = await getMilestone(Number(milestoneId));

        if (milestone.status === status) {
            return res.status(400).json({
                message: "Milestone is already in this status"
            });
        }

        await updateMilestone(Number(milestoneId), {
            status: status
        });

        const newContract = await getContract(Number(contractId));

        const newProgress = calculateProgress(
            newContract.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length,
            newContract.milestones.filter(m => m.status !== MilestoneStatus.CANCELLED).length)

        await updateContract(Number(contractId), {
            paid: (contract.paid ?? 0) + (milestone.amount ?? 0),
            progress: newProgress
        });


        return res.status(200).json(new Result({
            message: "Milestone completed successfully",
            data: {
                ...newContract,
                progress: newProgress
            },
            status: true
        }));


        return res.status(200).json(new Result({
            message: "Milestone status changed successfully",
            status: true
        }));

    } catch (error) {
        next(error);
    }
}


// Utills
const calculateProgress = (completedMilestones: number, totalMilestones: number) => {
    return (completedMilestones / totalMilestones) * 100;
}