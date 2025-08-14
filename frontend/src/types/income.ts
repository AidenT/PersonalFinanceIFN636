// Shared types for frontend - keep synchronized with backend types
// Location: backend/models/Income.ts has matching BaseIncome interface

// Base Income interface (matches backend)
export interface BaseIncome {
    amount: number;
    dateEarned: Date | string; // Frontend can handle both Date and string
    description?: string;
    category: 'Salary' | 'Freelance' | 'Investment' | 'Business' | 'Gift' | 'Other';
    source?: string;
    isRecurring: boolean;
    recurringFrequency?: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    startDate?: Date | string;
}

// Full Income interface (from API responses)
export interface Income extends BaseIncome {
    _id: string;
    userId: string;
    dateEarned: string; // API returns ISO string
    startDate?: string; // API returns ISO string
    createdAt: string;
    updatedAt: string;
}

// Income form data (for frontend forms)
export interface IncomeFormData {
    amount: string; // String for form inputs
    dateEarned: string;
    description: string;
    category: 'Salary' | 'Freelance' | 'Investment' | 'Business' | 'Gift' | 'Other';
    source: string;
    isRecurring: boolean;
    recurringFrequency?: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    startDate?: string;
}

// User types
export interface User {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    university?: string;
    address?: string;
    token: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    status: number;
}

// Constants for dropdowns and validation
export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance', 
    'Investment',
    'Business',
    'Gift',
    'Other'
] as const;

export const RECURRING_FREQUENCIES = [
    'Weekly',
    'Bi-weekly',
    'Monthly', 
    'Quarterly',
    'Yearly'
] as const;

// Utility types
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type RecurringFrequency = typeof RECURRING_FREQUENCIES[number];

// Type guards for runtime validation
export const isIncome = (obj: any): obj is Income => {
    return obj && 
           typeof obj._id === 'string' &&
           typeof obj.amount === 'number' &&
           typeof obj.userId === 'string' &&
           INCOME_CATEGORIES.includes(obj.category);
};

export const isValidIncomeCategory = (category: string): category is IncomeCategory => {
    return INCOME_CATEGORIES.includes(category as IncomeCategory);
};

export const isValidRecurringFrequency = (frequency: string): frequency is RecurringFrequency => {
    return RECURRING_FREQUENCIES.includes(frequency as RecurringFrequency);
};
