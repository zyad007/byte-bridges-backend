import { RequestHandler } from "express";
import { createWorker, deleteWorker, getWorkerById, getWorkers, updateWorker } from "../services/WorkerServices";
import BadRequest from "../errors/BadRequest";
import { JobType } from "../enum/WorkerSearch";
import { WorkerStatus } from "../enum/WorkerStatus";
import { WorkerUpdateType } from "../schemas/WorkerUpdate";
import { WorkerCreateType } from "../schemas/WorkerCreate";
import { getSocket } from "../socket.client";

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
        const socket = getSocket()
        socket.emit('create_worker', req.body)
        res.status(201).json({ message: 'Worker created successfully' })
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

        const socket = getSocket()
        socket.emit('update_worker', { id, ...req.body })
        res.status(200).json({ message: 'Worker updated successfully' })
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

        const socket = getSocket()
        socket.emit('delete_worker', id)
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

        const socket = getSocket()
        socket.emit('activate_worker', id)

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

        const socket = getSocket()
        socket.emit('deactivate_worker', id)

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
