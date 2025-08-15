import Expense, { IExpense } from '../models/Expense';
import { AuthenticatedRequest, ExpressResponse } from '../types/authTypes';
import { CreateExpenseRequest } from '../types/expenseTypes'

const getExpenses = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    try {
        const expenses: IExpense[] = await Expense.find({ userId: req.user?._id }).sort({ dateSpent: -1 });
        res.json(expenses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getExpenseById = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    try {
        const expense: IExpense | null = await Expense.findById(req.params.id);
        if (!expense) {
            res.status(404).json({ message: 'Expense not found' });
            return;
        }

        if (expense.userId.toString() !== req.user?._id) {
            res.status(403).json({ message: 'Not authorized to view this expense' });
            return;
        }

        res.json(expense);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const addExpense = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    const { 
        amount, 
        dateSpent, 
        description, 
        category, 
        merchant, 
        isRecurring, 
        recurringFrequency, 
        startDate 
    }: CreateExpenseRequest = req.body;

    try {
        // Validate required fields
        if (!amount || !description || !category || !merchant) {
            res.status(400).json({ 
                message: 'Missing required fields: amount, description, category, merchant' 
            });
            return;
        }

        // Validate amount is positive
        if (amount <= 0) {
            res.status(400).json({ message: 'Amount must be greater than 0' });
            return;
        }

        // Validate recurring expense fields
        if (isRecurring && !recurringFrequency) {
            res.status(400).json({ 
                message: 'Recurring frequency is required for recurring expenses' 
            });
            return;
        }

        if (isRecurring && !startDate) {
            res.status(400).json({ 
                message: 'Start date is required for recurring expenses' 
            });
            return;
        }

        const expenseData = {
            userId: req.user?._id,
            amount,
            dateSpent: dateSpent || new Date(),
            description,
            category,
            merchant,
            isRecurring: isRecurring || false,
            ...(isRecurring && { recurringFrequency }),
            ...(isRecurring && { startDate })
        };

        const expense: IExpense = await Expense.create(expenseData);
        res.status(201).json(expense);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExpense = async (req: AuthenticatedRequest, res: ExpressResponse): Promise<void> => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Export using both CommonJS and ES6 for compatibility
const expenseController = { 
    getExpenses,
    getExpenseById,
    addExpense,
    deleteExpense

};

// CommonJS export for Node.js
module.exports = expenseController;

// ES6 export for TypeScript/modern environments
export { getExpenses, getExpenseById, addExpense, deleteExpense };
export default expenseController;