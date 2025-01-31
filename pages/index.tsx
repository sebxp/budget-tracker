import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to the dashboard
      router.push('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}