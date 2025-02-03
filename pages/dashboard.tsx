import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CreateBudget from '../components/CreateBudget';
import EditBudget from '../components/EditBudget';
import RemoveBudget from '../components/RemoveBudget';
import styles from '../styles/Dashboard.module.css';

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
    <div className={styles.container}>
      <Head>
        <title>Dashboard - Budget Tracker</title>
        <meta name="description" content="Manage your finance in the Budget Tracker." />
      </Head>
      <h1 className={styles.header}>Budget Dashboard</h1>
      <CreateBudget onBudgetAdded={fetchBudgets} />
      <ul className={styles.budgetList}>
        {budgets.map((budget: any) => (
          <li key={budget._id} className={styles.budgetItem}>
            {budget.name}: ${budget.amount}
            <div className={styles.buttonGroup}>
              <button className={styles.editButton} onClick={() => setEditingBudget(budget)}>Edit</button>
              <RemoveBudget budgetId={budget._id} onBudgetRemoved={fetchBudgets} />
            </div>
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