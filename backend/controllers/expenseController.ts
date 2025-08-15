import Expense, { IExpense } from '../models/Expense';
import { AuthenticatedRequest, ExpressResponse } from '../types/authTypes';

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

// Export using both CommonJS and ES6 for compatibility
const expenseController = { 
    getExpenses,
    getExpenseById
};

// CommonJS export for Node.js
module.exports = expenseController;

// ES6 export for TypeScript/modern environments
export { getExpenses, getExpenseById };
export default expenseController;