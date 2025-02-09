import { db } from "../db"
import { Workers } from "../db/schema"
import { eq } from "drizzle-orm"
import BadRequest from "../errors/BadRequest"
import NotFound from "../errors/NotFound"
import { WorkerStatus } from "../enum/WorkerStatus"
import { like } from "drizzle-orm"

export const getWorkers = async (search?: string, page: number = 1, limit: number = 100) => {
    if (search) {
        const workers = await db.select().from(Workers).where(like(Workers.query, `%${search}%`))
        return workers
    }

    const workers = await db.select().from(Workers)
    return workers

}

export const getWorkerById = async (id: number) => {
    const worker = await db.select().from(Workers).where(eq(Workers.id, id))

    if (worker.length === 0) {
        throw new NotFound("Worker not found")
    }

    return worker[0]
}

export const createWorker = async (worker: {
    name?: string,
    description?: string,

    query: string,

    jobType?: string,

    fixedPrice?: string,
    proposalsNumber?: string,

    verifiedOnly?: boolean,
    previousClientsOnly?: boolean,
    notify?: boolean,
    status?: WorkerStatus,
}) => {

    const newWorker = await db.insert(Workers).values({
        name: worker.name ?? '',
        description: worker.description ?? '',

        query: worker.query,

        jobType: worker.jobType ?? '',
        fixedPrice: worker.fixedPrice ?? '',
        proposalsNumber: worker.proposalsNumber ?? '',
        verifiedOnly: worker.verifiedOnly ?? false,
        previousClientsOnly: worker.previousClientsOnly ?? false,
        notify: worker.notify ?? false,
        status: worker.status ?? WorkerStatus.INACTIVE,
    }).returning()


    return newWorker[0]
}

export const updateWorker = async (id: number, worker: {
    name?: string,
    description?: string,

    query?: string,

    jobType?: string,

    fixedPrice?: string,
    proposalsNumber?: string,

    verifiedOnly?: boolean,
    previousClientsOnly?: boolean,

    status?: WorkerStatus,
    notify?: boolean,
}) => {

    const originalWorker = await getWorkerById(id);

    const updatedWorker = await db.update(Workers).set({
        name: worker.name ?? originalWorker.name,
        description: worker.description ?? originalWorker.description,

        query: worker.query ?? originalWorker.query,

        jobType: worker.jobType ?? originalWorker.jobType,

        fixedPrice: worker.fixedPrice ?? originalWorker.fixedPrice,
        proposalsNumber: worker.proposalsNumber ?? originalWorker.proposalsNumber,

        verifiedOnly: worker.verifiedOnly ?? originalWorker.verifiedOnly,
        previousClientsOnly: worker.previousClientsOnly ?? originalWorker.previousClientsOnly,

        status: worker.status ?? originalWorker.status,
        notify: worker.notify ?? originalWorker.notify,
    }).where(eq(Workers.id, id)).returning()


    return updatedWorker[0]
}

export const deleteWorker = async (id: number) => {
    await getWorkerById(id)
    await db.delete(Workers).where(eq(Workers.id, id))
    return
}