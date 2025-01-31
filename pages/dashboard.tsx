import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Budget = {
    name: string;
    amount: number;
}
export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login if no token is found
      router.push('/');
      return;
    }

    const fetchBudgets = async () => {
      try {
        const response = await axios.get('/api/budget', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBudgets(response.data);
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
        // Handle token expiration or invalid token
        if (error.response && error.response.status === 403) {
          localStorage.removeItem('token');
          router.push('/');
        }
      }
    };

    fetchBudgets();
  }, [router]);

  return (
    <div>
      <h1>Budget Dashboard</h1>
      <ul>
        {budgets.map((budget, index) => (
          <li key={index}>
            {budget.name}: ${budget.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}