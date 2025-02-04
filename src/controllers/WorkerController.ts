import { RequestHandler } from "express";
import { createWorker, deleteWorker, getWorkerById, getWorkers, updateWorker } from "../services/WorkerServices";
import BadRequest from "../errors/BadRequest";
import { CreateWorkerType } from "../schemas/CreateWorker";
import { UpdateWorkerType } from "../schemas/UpdateWorker";

export const getWorkersAPI: RequestHandler<{}, {}, {}, { search: string }> = async (req, res, next) => {
    try {
        const { search } = req.query
        const workers = await getWorkers(search)
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
        const { searchUrl } = req.body as CreateWorkerType

        const worker = await createWorker(searchUrl)
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

        const { searchUrl, status, notify } = req.body as UpdateWorkerType

        const worker = await updateWorker(+id, { searchUrl, status, notify })
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