import { z } from 'zod'
import { JobProposalsNumber } from '../enum/WorkerSearch'
import { JobFixedPrice } from '../enum/WorkerSearch'
export const WorkerUpdateSchema = z.object({
    query: z.string({
        required_error: "query is required"
    }).optional(),

    isHourly: z.boolean().optional(),
    isFixedPrice: z.boolean().optional(),

    priceRanges: z.array(z.enum([
        JobFixedPrice.ZERO_TO_NINETY_NINE,
        JobFixedPrice.ONE_HUNDRED_TO_FOUR_NINETY_NINE,
        JobFixedPrice.FIVE_HUNDRED_TO_NINE_NINETY_NINE,

        JobFixedPrice.ONE_THOUSAND_TO_FOUR_NINETY_NINE,
        JobFixedPrice.FIVE_THOUSAND_AND_UP])).optional(),

    proposalsRanges: z.array(z.enum([
        JobProposalsNumber.ZERO_TO_FIVE,
        JobProposalsNumber.FIVE_TO_TEN,
        JobProposalsNumber.TEN_TO_FIFTEEN,
        JobProposalsNumber.FIFTEEN_TO_TWENTY,
        JobProposalsNumber.TWENTY_TO_FIFTY])).optional(),

    verifiedOnly: z.boolean().optional(),
    previousClientsOnly: z.boolean().optional(),

    workerName: z.string().optional(),
    workerDescription: z.string().optional(),
})

export type WorkerUpdateType = z.infer<typeof WorkerUpdateSchema>