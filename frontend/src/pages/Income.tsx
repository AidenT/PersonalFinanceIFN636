import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import IncomeForm from '../components/IncomeForm';
import { Income, User } from '../types/income';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const IncomePage: React.FC = () => {
  const { user }: { user: User | null } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch incomes when component mounts
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/income', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setIncomes(response.data);
      } catch (err: any) {
        console.error('Error fetching incomes:', err);
        setError('Failed to load incomes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchIncomes();
    }
  }, [user]);

  // Delete income function
  const handleDelete = async (incomeId: string) => {
    if (!window.confirm('Are you sure you want to delete this income record?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/income/${incomeId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setIncomes(incomes.filter(income => income._id !== incomeId));
    } catch (err: any) {
      console.error('Error deleting income:', err);
      setError('Failed to delete income. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to manage your income</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Income</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingIncome ? 'Edit Income' : 'Add New Income'}
            </h2>
            <IncomeForm
              incomes={incomes}
              setIncomes={setIncomes}
              editingIncome={editingIncome}
              setEditingIncome={setEditingIncome}
            />
          </div>

          {/* Income List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Income Records</h2>
              {incomes.length > 0 && (
                <div className="text-lg font-bold text-green-600">
                  Total: ${incomes.reduce((sum, income) => sum + income.amount, 0).toFixed(2)}
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-4">Loading incomes...</div>
            ) : incomes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No income records found. Add your first income entry!
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Earned</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Recurring</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomes.map((income) => (
                      <TableRow
                        key={income._id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setEditingIncome(income)}
                      >
                        <TableCell className="font-medium">
                          ${income.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{income.category}</TableCell>
                        <TableCell>
                          {income.description || '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(income.dateEarned).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {income.source || '-'}
                        </TableCell>
                        <TableCell>
                          {income.isRecurring ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {income.recurringFrequency}
                            </span>
                          ) : (
                            <span className="text-gray-500">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIncome(income);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(income._id);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
