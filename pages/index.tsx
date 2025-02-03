import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import commonStyles from "../styles/Common.module.css";
import styles from "../styles/Login.module.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please, provide username and password");
      return;
    }
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Redirect to the dashboard
      router.push("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login - Budget Tracker</title>
        <meta
          name="description"
          content="Login to your Budget Tracker account to manage your finances."
        />
      </Head>

      <div className={styles.card}>
        <h1 className={styles.title}>User Access</h1>
        <input
          className={styles.login}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className={styles.login}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className={styles.action} onClick={handleLogin}>
          Login
        </button>
        {error && (
          <p className={`${commonStyles.message} ${commonStyles.error}`}>
            {error}
          </p>
        )}
        <p>
          Don't have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
