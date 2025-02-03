// components/EditBudget.tsx

import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/EditBudget.module.css';

const EditBudget = ({ budgetItem, onBudgetUpdated }: { budgetItem: any, onBudgetUpdated: () => void }) => {
  const [name, setName] = useState(budgetItem.name || '');
  const [amount, setAmount] = useState(budgetItem.amount || '');

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/budget/${budgetItem._id}`, { name, amount: parseFloat(amount) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    </div>
  );
};

export default EditBudget;