export enum JobType {
    FIXED_PRICE = '0',
    HOURLY = '1',
    BOTH = '0,1'
}

export enum JobProposalsNumber {
    ZERO_TO_FIVE = '0-5',
    FIVE_TO_TEN = '5-10',
    TEN_TO_FIFTEEN = '10-15',
    FIFTEEN_TO_TWENTY = '15-20',
    TWENTY_TO_FIFTY = '20-50',
    FIFTY_AND_UP = '50-', // Jobs only (Not in Workers)
}

export enum JobFixedPrice {
    ZERO_TO_NINETY_NINE = '0-99',
    ONE_HUNDRED_TO_FOUR_NINETY_NINE = '100-499',
    FIVE_HUNDRED_TO_NINE_NINETY_NINE = '500-999',
    ONE_THOUSAND_TO_FOUR_NINETY_NINE = '1000-4999',
    FIVE_THOUSAND_AND_UP = '5000-',
}