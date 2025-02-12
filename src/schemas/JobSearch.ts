import { z } from 'zod'
import { JobProposalsNumber } from '../enum/WorkerSearch'
import { JobFixedPrice } from '../enum/WorkerSearch'
export const JobSearchSchema = z.object({
    query: z.string({
        required_error: "query is required"
    }),

    isHourly: z.boolean().optional(),
    isFixedPrice: z.boolean().optional(),

    priceRanges: z.array(z.enum([
        JobFixedPrice.ZERO_TO_NINETY_NINE,
        JobFixedPrice.ONE_HUNDRED_TO_FOUR_NINETY_NINE,
        JobFixedPrice.FIVE_HUNDRED_TO_NINE_NINETY_NINE,
        JobFixedPrice.ONE_THOUSAND_TO_FOUR_NINETY_NINE,
        JobFixedPrice.FIVE_THOUSAND_AND_UP,
    ])).optional(),

    proposalsRanges: z.array(z.enum([
        JobProposalsNumber.ZERO_TO_FIVE,
        JobProposalsNumber.FIVE_TO_TEN,
        JobProposalsNumber.TEN_TO_FIFTEEN,
        JobProposalsNumber.FIFTEEN_TO_TWENTY,
        JobProposalsNumber.TWENTY_TO_FIFTY,
        JobProposalsNumber.FIFTY_AND_UP,
    ])).optional(),

    verifiedOnly: z.boolean().optional(),

    workerId: z.number().optional(),

    customPriceRange: z.object({
        fixed: z.object({
            min: z.number(),
            max: z.number(),
        }).optional(),
        hourly: z.object({
            min: z.number(),
            max: z.number(),
        }).optional(),
    }).optional(),

    clientSpentRange: z.object({
        max: z.number(),
        min: z.number(),
    }).optional(),

    clientRatingRange: z.object({
        max: z.number(),
        min: z.number(),
    }).optional(),
})

export type JobSearchType = z.infer<typeof JobSearchSchema>