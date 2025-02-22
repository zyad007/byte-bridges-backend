import { RequestHandler } from "express";
import { createWorker, deleteWorker, getWorkerById, getWorkers, updateWorker } from "../services/WorkerServices";
import BadRequest from "../errors/BadRequest";
import { JobType } from "../enum/WorkerSearch";
import { WorkerStatus } from "../enum/WorkerStatus";
import { WorkerUpdateType } from "../schemas/WorkerUpdate";
import { WorkerCreateType } from "../schemas/WorkerCreate";
import { getSocket } from "../socket.client";
import { Result } from "../dto/Result";

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

        // Create a promise to handle the socket response
        const createWorkerPromise = new Promise((resolve, reject) => {
            // Listen for success response
            socket.once('worker_created', (data) => {
                resolve(data)
            })

            // Listen for error response
            socket.once('create_worker_error', (error) => {
                reject(error)
            })

            // Set timeout of 10 seconds
            setTimeout(() => {
                // Remove listeners to prevent memory leaks
                socket.off('worker_created')
                socket.off('worker_creation_error')
                reject(new Error('Worker creation timeout - no response received after 10 seconds'))
            }, 10000)
        })

        // Emit the create worker event
        socket.emit('create_worker', req.body)

        // Wait for the response
        const result: any = await createWorkerPromise
        res.status(result.status ? 201 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        // If it's a known error message, pass it through
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const updateWorkerAPI: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const updateWorkerPromise = new Promise((resolve, reject) => {
            socket.once('worker_updated', (data) => {
                resolve(data)
            })

            socket.once('update_worker_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('worker_updated')
                socket.off('update_worker_error')
                reject(new Error('Worker update timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('update_worker', { id, ...req.body })

        const result: any = await updateWorkerPromise
        res.status(result.status ? 200 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const deleteWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(id)) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const deleteWorkerPromise = new Promise((resolve, reject) => {
            socket.once('worker_deleted', (data) => {
                resolve(data)
            })

            socket.once('delete_worker_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('worker_deleted')
                socket.off('delete_worker_error')
                reject(new Error('Worker deletion timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('delete_worker', id)

        const result: any = await deleteWorkerPromise
        res.status(result.status ? 204 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const activateWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const activateWorkerPromise = new Promise((resolve, reject) => {
            socket.once('worker_activated', (data) => {
                resolve(data)
            })

            socket.once('activate_worker_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('worker_activated')
                socket.off('activate_worker_error')
                reject(new Error('Worker activation timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('activate_worker', id)

        const result: any = await activateWorkerPromise
        console.log(result);
        res.status(result.status ? 200 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const deactivateWorkerAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const deactivateWorkerPromise = new Promise((resolve, reject) => {
            socket.once('worker_deactivated', (data) => {
                resolve(data)
            })

            socket.once('deactivate_worker_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('worker_deactivated')
                socket.off('deactivate_worker_error')
                reject(new Error('Worker deactivation timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('deactivate_worker', id)

        const result: any = await deactivateWorkerPromise
        res.status(result.status ? 200 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const turnOffNotificationsAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const turnOffNotificationsPromise = new Promise((resolve, reject) => {
            socket.once('notifications_turned_off', (data) => {
                resolve(data)
            })

            socket.once('turn_off_notifications_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('notifications_turned_off')
                socket.off('turn_off_notifications_error')
                reject(new Error('Turn off notifications timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('turn_off_notifications', id)

        const result: any = await turnOffNotificationsPromise
        res.status(result.status ? 200 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}

export const turnOnNotificationsAPI: RequestHandler<{ id: number }> = async (req, res, next) => {
    try {
        const { id } = req.params

        if (isNaN(Number(id))) {
            throw new BadRequest("Invalid worker id")
        }

        const socket = getSocket()

        const turnOnNotificationsPromise = new Promise((resolve, reject) => {
            socket.once('notifications_turned_on', (data) => {
                resolve(data)
            })

            socket.once('turn_on_notifications_error', (error) => {
                reject(error)
            })

            setTimeout(() => {
                socket.off('notifications_turned_on')
                socket.off('turn_on_notifications_error')
                reject(new Error('Turn on notifications timeout - no response received after 10 seconds'))
            }, 10000)
        })

        socket.emit('turn_on_notifications', id)

        const result: any = await turnOnNotificationsPromise
        res.status(result.status ? 200 : 400).json(new Result({ status: result.status, message: result.message, data: result.data }))
    }
    catch (error) {
        if (error instanceof Error) {
            next(new BadRequest(error.message))
        } else {
            next(error)
        }
    }
}
