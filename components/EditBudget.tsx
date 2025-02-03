// components/EditBudget.tsx

import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/EditBudget.module.css';

const EditBudget = ({ budgetItem, onBudgetUpdated }: { budgetItem: any, onBudgetUpdated: () => void }) => {
  const [name, setName] = useState(budgetItem.name || '');
  const [amount, setAmount] = useState(budgetItem.amount || '');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!name || !amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid name and amount.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/budget/${budgetItem._id}`, { name, amount: parseFloat(amount) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setError('');
      onBudgetUpdated();
    } catch (error) {
      console.error('Failed to update budget item:', error);
    }
  };

  return (
    <div className={styles.form}>
      <h2>Edit Budget Item</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className={styles.input}
      />
      <button className={styles.button} onClick={handleUpdate}>Update</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default EditBudget;