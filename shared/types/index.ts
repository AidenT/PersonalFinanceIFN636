// Shared types for both frontend and backend
// This file contains all the interfaces and types that are used across the application

// Income related types
export interface BaseIncome {
    amount: number;
    dateEarned: Date | string;
    description?: string;
    category: 'Salary' | 'Freelance' | 'Investment' | 'Business' | 'Gift' | 'Other';
    source?: string;
    isRecurring: boolean;
    recurringFrequency?: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
    startDate?: Date | string;
}

// Full Income interface (with database fields)
export interface Income extends BaseIncome {
    _id: string;
    userId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
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

// Income creation data (for API requests)
export interface CreateIncomeRequest extends BaseIncome {
    // Inherits all BaseIncome fields
}

// Income update data (for API requests)
export interface UpdateIncomeRequest extends Partial<BaseIncome> {
    // All fields are optional for updates
}

// User related types
export interface BaseUser {
    name: string;
    email: string;
    university?: string;
    address?: string;
}

export interface User extends BaseUser {
    _id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface UserFormData extends BaseUser {
    password?: string;
}

export interface AuthUser extends User {
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

// Form validation types
export interface ValidationError {
    field: string;
    message: string;
}

// Category and frequency constants (can be used for dropdowns)
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

// Type guards for runtime type checking
export const isIncome = (obj: any): obj is Income => {
    return obj && 
           typeof obj._id === 'string' &&
           typeof obj.amount === 'number' &&
           typeof obj.userId === 'string' &&
           INCOME_CATEGORIES.includes(obj.category);
};

export const isUser = (obj: any): obj is User => {
    return obj && 
           typeof obj._id === 'string' &&
           typeof obj.name === 'string' &&
           typeof obj.email === 'string';
};

// Utility types for common patterns
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type RecurringFrequency = typeof RECURRING_FREQUENCIES[number];
