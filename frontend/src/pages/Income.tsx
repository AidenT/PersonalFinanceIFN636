import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import IncomeForm from '../components/IncomeForm';
import { Income, User } from '../types/income';

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
        const response = await axiosInstance.get('/api/income');
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
            <h2 className="text-xl font-semibold mb-4">Your Income Records</h2>
            
            {loading ? (
              <div className="text-center py-4">Loading incomes...</div>
            ) : incomes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No income records found. Add your first income entry!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {incomes.map((income) => (
                  <div
                    key={income._id}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setEditingIncome(income)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">${income.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{income.category}</div>
                        {income.description && (
                          <div className="text-sm text-gray-500">{income.description}</div>
                        )}
                        <div className="text-xs text-gray-400">
                          {new Date(income.dateEarned).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        {income.isRecurring && (
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {income.recurringFrequency}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
