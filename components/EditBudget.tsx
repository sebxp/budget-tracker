// components/EditBudget.tsx

import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import commonStyles from "../styles/Common.module.css";
import styles from "../styles/EditBudget.module.css";

const EditBudget = ({
  budgetItem,
  onBudgetUpdated,
}: {
  budgetItem: any;
  onBudgetUpdated: () => void;
}) => {
  const [name, setName] = useState(budgetItem.name || "");
  const [amount, setAmount] = useState(budgetItem.amount || "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleUpdate = async () => {
    if (!name || !amount || isNaN(parseFloat(amount))) {
      setIsError(true);
      setMessage("Please enter a valid name and amount.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/budget/${budgetItem._id}`,
        { name, amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setIsError(false);
      onBudgetUpdated();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          // Remove the token from local storage
          localStorage.removeItem("token");

          // Redirect to the login page
          router.push("/");
        } else {
          setIsError(true);
          setMessage(
            error.response.data.message || "Failed to update budget item."
          );
        }
      }
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
      <button className={styles.button} onClick={handleUpdate}>
        Update
      </button>
      {message && (
        <p
          className={`${commonStyles.message} ${
            isError ? commonStyles.error : commonStyles.success
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EditBudget;
