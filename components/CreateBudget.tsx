import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/CreateBudget.module.css';

export default function CreateBudget({ onBudgetAdded }: { onBudgetAdded: () => void }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/budget', { name, amount: parseFloat(amount) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName('');
      setAmount('');
      onBudgetAdded();
    } catch (error) {
      console.error('Failed to create budget item:', error);
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
    </div>
  );
}