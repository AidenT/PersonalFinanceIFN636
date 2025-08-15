import { INCOME_CATEGORIES, RECURRING_FREQUENCIES, IncomeCategory, RecurringFrequency } from '../../../backend/models/Income';

// Income form data (for frontend forms)
export interface IncomeFormData {
    amount: string; // String for form inputs
    dateEarned: string;
    description: string;
    category: IncomeCategory;
    source: string;
    isRecurring: boolean;
    recurringFrequency?: RecurringFrequency;
    startDate?: string;
}

export const isValidIncomeCategory = (category: string): category is IncomeCategory => {
    return INCOME_CATEGORIES.includes(category as IncomeCategory);
};

export const isValidRecurringFrequency = (frequency: string): frequency is RecurringFrequency => {
    return RECURRING_FREQUENCIES.includes(frequency as RecurringFrequency);
};
