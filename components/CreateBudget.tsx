import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/CreateBudget.module.css';

export default function CreateBudget({ onBudgetAdded }: { onBudgetAdded: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid name and amount.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/budget', { name, amount: parseFloat(amount) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName('');
      setAmount('');
      setError('');
      onBudgetAdded();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          // Remove the token from local storage
          localStorage.removeItem('token');

          // Redirect to the login page
          router.push('/');
        }
        else
          setError('An error ocurred while trying to create a new budget item');
      }
    }
  };

  return (
    <div className={styles.form}>
      <h2>Create Budget Item</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleSubmit} className={styles.button}>Add</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}