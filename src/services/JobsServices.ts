import { and, eq, ilike, like, or } from "drizzle-orm";
import { db } from "../db";
import { Jobs } from "../db/schema";

export async function getAll(
    page: number,
    limit: number,
    search: string,
    interested: boolean
) {
    try {
        const offset = (page - 1) * limit;

        let conditions = [];

        if (search) {
            conditions.push(or(ilike(Jobs.title, `%${search}%`), ilike(Jobs.description, `%${search}%`)));
        }

        if (interested) {
            conditions.push(eq(Jobs.ignore, false));
        }

        let query = db.select().from(Jobs).where(and(...conditions)).limit(limit).offset(offset);

        const jobs = await query;
        
        return jobs;
    } catch (error) {
        throw error;
    }
}

export async function getFavorites(
    page: number,
    limit: number,
    search: string
) {
    try {
        const offset = (page - 1) * limit;

        let conditions = [];

        if (search) {
            conditions.push(or(ilike(Jobs.title, `%${search}%`), ilike(Jobs.description, `%${search}%`)));
        }

        conditions.push(eq(Jobs.favourite, true));

        let query = db.select().from(Jobs).where(and(...conditions)).limit(limit).offset(offset);

        const jobs = await query;
        
        return jobs;
    } catch (error) {
        throw error;
    }
}

export async function addFavorite(jobId: number) {
    try {
        await db.update(Jobs).set({ favourite: true }).where(eq(Jobs.id, jobId));
    } catch (error) {
        throw error;
    }
}

export async function removeFavorite(jobId: number) {
    try {
        await db.update(Jobs).set({ favourite: false }).where(eq(Jobs.id, jobId));
    } catch (error) {
        throw error;
    }
}

export async function markAsNotInterested(jobId: number) {
    try {
        await db.update(Jobs).set({ ignore: true }).where(eq(Jobs.id, jobId));
    } catch (error) {
        throw error;
    }
}

export async function markAsInterested(jobId: number) {
    try {
        await db.update(Jobs).set({ ignore: false }).where(eq(Jobs.id, jobId));
    } catch (error) {
        throw error;
    }
}

