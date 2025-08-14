// Income-related types
export interface IncomeData {
    _id?: string;
    userId: string;
    amount: number;
    dateEarned: Date;
    description: string;
    category: string;
    source: string;
    isRecurring: boolean;
    recurringFrequency?: string;
    startDate?: Date;
    createdAt: Date;
    save?: () => Promise<IncomeData>;
    remove?: () => Promise<void>;
}

export interface CreateIncomeRequest {
    amount: number;
    dateEarned?: Date;
    description: string;
    category: string;
    source: string;
    isRecurring?: boolean;
    recurringFrequency?: string;
    startDate?: Date;
}

export interface UpdateIncomeRequest {
    amount?: number;
    dateEarned?: Date;
    description?: string;
    category?: string;
    source?: string;
    isRecurring?: boolean;
    recurringFrequency?: string;
    startDate?: Date;
}
