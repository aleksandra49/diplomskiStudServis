import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // Ovde uvozite CSS fajl

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username: username,
        password: password,
      });

      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Pogrešno korisničko ime ili lozinka.');
      } else {
        setError('Problem sa povezivanjem na server.');
      }
    }
  };

  return (
    <div className="login-container">
      {/* Grb dodat na login ekran */}
      <img 
        src="https://serbiagbc.rs/wp-content/uploads/2020/06/FTN-Logo.png" 
        alt="Grb" 
        className="login-logo" 
      />
      
      <h2 className="login-title">Prijava na Studentski Servis</h2>

      {error && (
        <div className="error-box" style={{ color: 'rgb(255, 0, 0)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            id="username"
            type="text"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group-password">
          <label htmlFor="password">Lozinka:</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Login;