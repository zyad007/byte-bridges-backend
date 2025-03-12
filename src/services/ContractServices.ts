import { Attachments, Contracts, Milestones } from "../db/schema";
import { db } from "../db";
import { asc, desc, eq, like, or, and } from "drizzle-orm";
import BadRequest from "../errors/BadRequest";

// CRUD
export async function createContract(contract: typeof Contracts.$inferInsert): Promise<typeof Contracts.$inferInsert> {
    const newContract = await db.insert(Contracts).values(contract).returning();
    return newContract[0];
}

export async function getContract(id: number): Promise<typeof Contracts.$inferSelect> {
    const contract = await db.select().from(Contracts).where(eq(Contracts.id, id));
    return contract[0];
}

export async function getContracts({
    page = 1,
    limit = 10,
    search,
    type,
    status,
    sort,
}: {
    page?: number,
    limit?: number,
    search?: string,
    type?: string,
    status?: string,
    sort?: {
        field: 'total' | 'paid' | 'progress' | 'deadline' | 'nextDeadline' | 'startDate',
        order: 'asc' | 'desc'
    }
}): Promise<typeof Contracts.$inferSelect[]> {

    if (page < 1 || limit < 1) {
        throw new BadRequest("Page and limit must be greater than 0");
    }

    const query = db.select().from(Contracts);

    const searchQuery = []

    if (search) {
        searchQuery.push(
            or(
                like(Contracts.title, `%${search}%`),
                like(Contracts.ownerName, `%${search}%`),
                like(Contracts.ownerEmail, `%${search}%`),
                like(Contracts.ownerPhone, `%${search}%`)
            )
        );
    }

    if (type) {
        searchQuery.push(eq(Contracts.type, type));
    }

    if (status) {
        searchQuery.push(eq(Contracts.status, status));
    }

    if (searchQuery.length > 0) {
        query.where(and(...searchQuery));
    }

    if (sort) {
        const order = sort.order === 'asc' ? asc : desc;
        query.orderBy(order(Contracts[sort.field]));
    }

    const contracts = await query.limit(limit).offset((page - 1) * limit);
    return contracts;
}

export async function updateContract(id: number, contract: Partial<typeof Contracts.$inferInsert>): Promise<typeof Contracts.$inferSelect> {
    const updatedContract = await db.update(Contracts).set(contract).where(eq(Contracts.id, id)).returning();
    return updatedContract[0];
}

export async function deleteContract(id: number): Promise<void> {
    await db.delete(Contracts).where(eq(Contracts.id, id));
}

// Milestones
export async function createMilestone(contractId: number, milestone: Partial<typeof Milestones.$inferInsert>): Promise<typeof Milestones.$inferInsert> {
    const newMilestone = await db.insert(Milestones).values({ ...milestone, contractId }).returning();
    return newMilestone[0];
}

export async function getMilestone(id: number): Promise<typeof Milestones.$inferSelect> {
    const milestone = await db.select().from(Milestones).where(eq(Milestones.id, id));
    return milestone[0];
}

export async function getMilestones(contractId: number): Promise<typeof Milestones.$inferSelect[]> {
    const milestones = await db.select().from(Milestones).where(eq(Milestones.contractId, contractId));
    return milestones;
}

export async function updateMilestone(id: number, milestone: Partial<typeof Milestones.$inferInsert>): Promise<typeof Milestones.$inferSelect> {
    const updatedMilestone = await db.update(Milestones).set(milestone).where(eq(Milestones.id, id)).returning();
    return updatedMilestone[0];
}

export async function deleteMilestone(id: number): Promise<void> {
    await db.delete(Milestones).where(eq(Milestones.id, id));
}

// Attachments
export async function createAttachment(contractId: number, attachment: Partial<typeof Attachments.$inferInsert>): Promise<typeof Attachments.$inferInsert> {
    const newAttachment = await db.insert(Attachments).values({ ...attachment, contractId }).returning();
    return newAttachment[0];
}

export async function getAttachment(id: number): Promise<typeof Attachments.$inferSelect> {
    const attachment = await db.select().from(Attachments).where(eq(Attachments.id, id));
    return attachment[0];
}

export async function getAttachments(contractId: number): Promise<typeof Attachments.$inferSelect[]> {
    const attachments = await db.select().from(Attachments).where(eq(Attachments.contractId, contractId));
    return attachments;
}

export async function updateAttachment(id: number, attachment: Partial<typeof Attachments.$inferInsert>): Promise<typeof Attachments.$inferSelect> {
    const updatedAttachment = await db.update(Attachments).set(attachment).where(eq(Attachments.id, id)).returning();
    return updatedAttachment[0];
}

export async function deleteAttachment(id: number): Promise<void> {
    await db.delete(Attachments).where(eq(Attachments.id, id));
}