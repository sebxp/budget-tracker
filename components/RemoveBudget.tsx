// components/RemoveBudget.tsx

import axios from 'axios';

const RemoveBudget = ({ budgetId, onBudgetRemoved }: { budgetId: string, onBudgetRemoved: () => void }) => {
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
    <button onClick={handleRemove}>Remove</button>
  );
};

export default RemoveBudget;