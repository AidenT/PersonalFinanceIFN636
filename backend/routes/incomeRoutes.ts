import express from 'express';
import { getIncomes, addIncome, updateIncome, deleteIncome, getIncomeById } from '../controllers/incomeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// GET /api/income - Get all incomes for authenticated user
router.get('/', protect, getIncomes);

// GET /api/income/:id - Get specific income by ID
router.get('/:id', protect, getIncomeById);

// POST /api/income/addIncome - Add new income
router.post('/addIncome', protect, addIncome);

// PUT /api/income/:id - Update income by ID
router.put('/:id', protect, updateIncome);

// DELETE /api/income/:id - Delete income by ID
router.delete('/:id', protect, deleteIncome);

export default router;
