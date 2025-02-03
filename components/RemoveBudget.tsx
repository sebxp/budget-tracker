// components/RemoveBudget.tsx

import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/RemoveBudget.module.css';
import ConfirmDialog from './ConfirmDialog';

const RemoveBudget = ({ budgetId, onBudgetRemoved }: { budgetId: string, onBudgetRemoved: () => void }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const handleRemove = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/budget/${budgetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onBudgetRemoved();
    } catch (error) {
      console.error('Failed to remove budget item:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)} className={styles.button}>Remove</button>
      {showConfirm && (
        <ConfirmDialog
          message="Are you sure you want to remove this budget item?"
          onConfirm={handleRemove}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>

  );
};

export default RemoveBudget;