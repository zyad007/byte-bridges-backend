import { and, between, eq, gte, ilike, inArray, like, lte, or } from "drizzle-orm";
import { db } from "../db";
import { Jobs } from "../db/schema";
import { JobSearchType } from "../schemas/JobSearch";

export async function getAll(
    page: number,
    limit: number,
    jobSearch: JobSearchType
) {
    try {
        const offset = (page - 1) * limit;

        let conditions = [];

        // Query
        if (jobSearch.query) {
            conditions.push(or(ilike(Jobs.title, `%${jobSearch.query}%`), ilike(Jobs.description, `%${jobSearch.query.toLowerCase()}%`)));
        }

        // Type: Hourly
        if (jobSearch.isHourly) {
            conditions.push(eq(Jobs.type, "HOURLY"));
        }

        // Type: Fixed Price
        if (jobSearch.isFixedPrice) {
            conditions.push(eq(Jobs.type, "FIXED"));
        }

        // Price Ranges
        if (jobSearch.priceRanges) {
            const priceConditions = [];
            for (const priceRange of jobSearch.priceRanges) {

                const [min, max] = priceRange.split("-");
                if (min && max) {
                    priceConditions.push(between(Jobs.amount, parseInt(min), parseInt(max)));
                }

                if (min && !max) {
                    priceConditions.push(gte(Jobs.amount, parseInt(min)));
                }

                if (!min && max) {
                    priceConditions.push(lte(Jobs.amount, parseInt(max)));
                }
            }

            conditions.push(or(...priceConditions));
        }

        // Custom Price Range
        if (jobSearch.customPriceRange) {
            if (jobSearch.customPriceRange.fixed) {
                const { min, max } = jobSearch.customPriceRange.fixed;
                if (min && max) {
                    conditions.push(between(Jobs.amount, min, max));
                }

                if (min && !max) {
                    conditions.push(gte(Jobs.amount, min));
                }

                if (max && !min) {
                    conditions.push(lte(Jobs.amount, max));
                }
            }

            // TODO: Add hourly range
            // if (jobSearch.customPriceRange.hourly) {

            // }
        }

        // Proposals Ranges
        if (jobSearch.proposalsRanges) {
            const propoalsConditions = [];
            for (const proposalsRange of jobSearch.proposalsRanges) {
                propoalsConditions.push(eq(Jobs.proposalsNumber, proposalsRange));
            }
            conditions.push(or(...propoalsConditions));
        }

        // Verified Only
        if (jobSearch.verifiedOnly) {
            conditions.push(eq(Jobs.paymentVerified, true));
        }

        // Client Spent Range
        if (jobSearch.clientSpentRange) {
            const { min, max } = jobSearch.clientSpentRange;
            if (min && max) {
                conditions.push(between(Jobs.clientSpent, min, max));
            }

            if (min && !max) {
                conditions.push(gte(Jobs.clientSpent, min));
            }

            if (max && !min) {
                conditions.push(lte(Jobs.clientSpent, max));
            }
        }

        // Client Rating Range
        if (jobSearch.clientRatingRange) {
            const { min, max } = jobSearch.clientRatingRange;
            if (min && max) {
                conditions.push(between(Jobs.clientRate, min, max));
            }

            if (min && !max) {
                conditions.push(gte(Jobs.clientRate, min));
            }

            if (max && !min) {
                conditions.push(lte(Jobs.clientRate, max));
            }
        }

        // Worker IDs
        if (jobSearch.workerIds) {
            conditions.push(inArray(Jobs.workerId, jobSearch.workerIds));
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

