// pages/register.tsx

import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import commonStyles from "../styles/Common.module.css";
import styles from "../styles/Register.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please, provide username and password");
      return;
    }
    try {
      await axios.post("/api/auth/register", { username, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Register - Budget Tracker</title>
        <meta
          name="description"
          content="Register for a Budget Tracker account to manage your finances."
        />
      </Head>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
        />
        <button className={styles.button} onClick={handleRegister}>
          Register
        </button>
        {error && (
          <p className={`${commonStyles.message} ${commonStyles.error}`}>
            {error}
          </p>
        )}
        {success && (
          <p className={`${commonStyles.message} ${commonStyles.success}`}>
            {success}
          </p>
        )}
        <p>
          Already have an account? <Link href="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}
