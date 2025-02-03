// components/RemoveBudget.tsx

import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../styles/RemoveBudget.module.css';
import ConfirmDialog from './ConfirmDialog';

const RemoveBudget = ({ budgetId, onBudgetRemoved }: { budgetId: string, onBudgetRemoved: () => void }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          // Remove the token from local storage
          localStorage.removeItem('token');

          // Redirect to the login page
          router.push('/');
        }
        else
          setError('An error ocurred while trying to remove this item');
      }
    }
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)} className={styles.button}>Remove</button>
      {error && <p className={styles.error}>{error}</p>}
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