import mongoose, { Schema, Document, Model } from 'mongoose';
import { 
    EXPENSE_CATEGORIES, 
    RECURRING_FREQUENCIES,
    BaseExpense
} from '../../shared/types/expense';

// Mongoose Document interface for Expense
export interface IExpense extends Document, BaseExpense {
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: [0, 'Amount must be positive']
    },
    dateSpent: { 
        type: Date, 
        required: true,
        default: Date.now
    },
    description: { 
        type: String
    },
    category: { 
        type: String, 
        required: true,
        enum: Object.values(EXPENSE_CATEGORIES),
        default: 'Other'
    },
    merchant: { 
        type: String, 
    },
    isRecurring: { 
        type: Boolean, 
        default: false 
    },
    recurringFrequency: { 
        type: String,
        enum: Object.values(RECURRING_FREQUENCIES),
        required: function(this: IExpense) {
            return this.isRecurring;
        }
    },
    startDate: { 
        type: Date,
        required: function(this: IExpense) {
            return this.isRecurring;
        }
    }
}, {
    timestamps: true
});

// This is the syntax for adding static methods
expenseSchema.statics.findByUserId = function(userId: string) {
    return this.find({ userId }).sort({ dateSpent: -1 });
};

expenseSchema.statics.findRecurringExpenses = function(userId: string) {
    return this.find({ userId, isRecurring: true });
};

expenseSchema.statics.getTotalExpenseForPeriod = function(userId: string, startDate: Date, endDate: Date) {
    return this.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateSpent: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
};

// Define the model interface with static methods
interface IExpenseModel extends Model<IExpense> {
    findByUserId(userId: string): Promise<IExpense[]>;
    findRecurringExpenses(userId: string): Promise<IExpense[]>;
    getTotalExpenseForPeriod(userId: string, startDate: Date, endDate: Date): Promise<any[]>;
}

// Create and export the model, to be new'd up in controllers.
const Expense: IExpenseModel = mongoose.model<IExpense, IExpenseModel>('Expense', expenseSchema);

// Export the model
export default Expense;