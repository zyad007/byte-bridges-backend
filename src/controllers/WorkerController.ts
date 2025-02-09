import { RequestHandler } from "express";
import { createWorker, deleteWorker, getWorkerById, getWorkers, updateWorker } from "../services/WorkerServices";
import BadRequest from "../errors/BadRequest";
import { JobType } from "../enum/WorkerSearch";
import { WorkerStatus } from "../enum/WorkerStatus";
import { WorkerUpdateType } from "../schemas/WorkerUpdate";
import { WorkerCreateType } from "../schemas/WorkerCreate";

export const getWorkersAPI: RequestHandler<{}, {}, {}, { search?: string, page?: number, limit?: number }> = async (req, res, next) => {
    try {
        const { search, page, limit } = req.query
        const workers = await getWorkers(search, page, limit)
        res.status(200).json(workers)
    }
    catch (error) {
        next(error)
    }
}

export const getWorkerByIdAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(id)) {
            throw new BadRequest("Invalid worker id")
        }

        const worker = await getWorkerById(id)
        res.status(200).json(worker)
    }
    catch (error) {
        next(error)
    }
}

export const createWorkerAPI: RequestHandler = async (req, res, next) => {
    try {
        const {
            query,
            priceRanges,
            proposalsRanges,
            verifiedOnly,
            previousClientsOnly,
            workerName,
            workerDescription,
            isFixedPrice,
            isHourly
        } = req.body as WorkerCreateType

        const fixedPrice = priceRanges ? priceRanges.join(',') : ''
        const proposalsNumber = proposalsRanges ? proposalsRanges.join(',') : ''

        let jobType = JobType.BOTH

        if (isFixedPrice && !isHourly) {
            jobType = JobType.FIXED_PRICE
        }
        if (!isFixedPrice && isHourly) {
            jobType = JobType.HOURLY
        }

        const worker = await createWorker({
            query,
            fixedPrice,
            proposalsNumber,
            verifiedOnly,
            previousClientsOnly,
            name: workerName ?? query,
            description: workerDescription,
            jobType,

            status: WorkerStatus.ACTIVE,
            notify: true
        })

        res.status(201).json(worker)
    }

    catch (error) {
        next(error)
    }

}

export const updateWorkerAPI: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const {
            query,
            priceRanges,
            proposalsRanges,
            verifiedOnly,
            previousClientsOnly,
            workerName,
            workerDescription,
            isFixedPrice,
            isHourly
        } = req.body as WorkerUpdateType


        const fixedPrice = priceRanges ? priceRanges.join(',') : ''
        const proposalsNumber = proposalsRanges ? proposalsRanges.join(',') : ''

        let jobType = JobType.BOTH

        if (isFixedPrice && !isHourly) {
            jobType = JobType.FIXED_PRICE
        }
        if (!isFixedPrice && isHourly) {
            jobType = JobType.HOURLY
        }

        const worker = await updateWorker(+id, {
            query,
            fixedPrice,
            proposalsNumber,
            verifiedOnly,
            previousClientsOnly,
            name: workerName,
            description: workerDescription,
            jobType,
        })
        res.status(200).json(worker)
    }

    catch (error) {
        next(error)
    }

}

export const deleteWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(id)) {
            throw new BadRequest("Invalid worker id")
        }

        await deleteWorker(id)
        res.status(204).send()
    }

    catch (error) {
        next(error)
    }
}

export const activateWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        await updateWorker(+id, {
            status: WorkerStatus.ACTIVE,
        })

        res.status(204).send()
    }
    catch (error) {
        next(error)
    }
}

export const deactivateWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        await updateWorker(+id, {
            status: WorkerStatus.INACTIVE,
        })

        res.status(204).send()
    }
    catch (error) {
        next(error)
    }
}

export const turnOffNotificationsAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        await updateWorker(+id, {
            notify: false
        })

        res.status(204).send()
    }
    catch (error) {
        next(error)
    }
}

export const turnOnNotificationsAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        await updateWorker(+id, {
            notify: true
        })

        res.status(204).send()
    }
    catch (error) { next(error) }
}
