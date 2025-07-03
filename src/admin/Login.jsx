import { useState } from 'react';
import '../styles/AdminLogin.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Mock credentials (replace with real auth logic)
  const validUser = 'admin';
  const validPass = 'password123';

  function handleSubmit(e) {
    e.preventDefault();
    if (username === validUser && password === validPass) {
      setError('');
      onLogin(true);
    } else {
      setError('Invalid username or password');
    }
  }

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">
          Log In
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
