import { EXPENSE_CATEGORIES, RECURRING_FREQUENCIES, ExpenseCategory, RecurringFrequency } from '../../../backend/models/Expense';

// Expense form data (for frontend forms)
export interface ExpenseFormData {
    amount: string; // String for form inputs
    dateSpent: string;
    description: string;
    category: ExpenseCategory;
    merchant: string;
    isRecurring: boolean;
    recurringFrequency?: RecurringFrequency;
    startDate?: string;
}

export const isValidExpenseCategory = (category: string): category is ExpenseCategory => {
    return EXPENSE_CATEGORIES.includes(category as ExpenseCategory);
};

export const isValidRecurringFrequency = (frequency: string): frequency is RecurringFrequency => {
    return RECURRING_FREQUENCIES.includes(frequency as RecurringFrequency);
};
