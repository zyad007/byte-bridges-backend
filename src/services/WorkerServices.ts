import { db } from "../db"
import { Workers } from "../db/schema"
import { eq } from "drizzle-orm"
import BadRequest from "../errors/BadRequest"
import NotFound from "../errors/NotFound"
import { CreateWorkerType } from "../schemas/CreateWorker"
import { WorkerStatus } from "../enum/WorkerStatus"
import { UpdateWorkerType } from "../schemas/UpdateWorker"
import { like } from "drizzle-orm"

export const getWorkers = async (search: string | undefined) => {
    const workers = await db.select().from(Workers).where(like(Workers.searchUrl, `%${search}%`))
    return workers
}

export const getWorkerById = async (id: number) => {
    const worker = await db.select().from(Workers).where(eq(Workers.id, id))

    if (worker.length === 0) {
        throw new NotFound("Worker not found")
    }

    return worker[0]
}

export const createWorker = async (searchUrl: string) => {

    try {
        new URL(searchUrl)
    }
    catch (error) {
        throw new BadRequest("Invalid search URL")
    }


    const newWorker = await db.insert(Workers).values({
        searchUrl,
        status: WorkerStatus.DISABLED,
        notify: false,
        jobCount: 0

    }).returning()


    return newWorker[0]
}

export const updateWorker = async (id: number, worker: UpdateWorkerType) => {

    const { searchUrl, status, notify } = worker

    const originalWorker = await getWorkerById(id);

    if (searchUrl) {
        try {
            new URL(searchUrl)
        }
        catch (error) {
            throw new BadRequest("Invalid search URL")
        }
    }

    const updatedWorker = await db.update(Workers).set({
        searchUrl: searchUrl ?? originalWorker.searchUrl,
        status: status ?? originalWorker.status,
        notify: notify ?? originalWorker.notify
    }).where(eq(Workers.id, id)).returning()

    return updatedWorker[0]
}

export const deleteWorker = async (id: number) => {
    await getWorkerById(id)
    await db.delete(Workers).where(eq(Workers.id, id))
    return
}

