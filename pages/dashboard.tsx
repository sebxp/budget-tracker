import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateBudget from '../components/CreateBudget';
import EditBudget from '../components/EditBudget';
import RemoveBudget from '../components/RemoveBudget';

export default function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const router = useRouter();

  const fetchBudgets = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('/api/budget', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBudgets(response.data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
      if (error.response && error.response.status === 403) {
        localStorage.removeItem('token');
        router.push('/');
      }
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div>
      <h1>Budget Dashboard</h1>
      <CreateBudget onBudgetAdded={fetchBudgets} />
      <ul>
        {budgets.map((budget: any) => (
          <li key={budget._id}>
            {budget.name}: ${budget.amount}
            <button onClick={() => setEditingBudget(budget)}>Edit</button>
            <RemoveBudget budgetId={budget._id} onBudgetRemoved={fetchBudgets} />
          </li>
        ))}
      </ul>
      {editingBudget && (
        <EditBudget budgetItem={editingBudget} onBudgetUpdated={() => {
          fetchBudgets();
          setEditingBudget(null);
        }} />
      )}
    </div>
  );
}