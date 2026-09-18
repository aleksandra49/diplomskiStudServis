import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Šaljemo prijavu na tvoj Spring Boot backend
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        username: username,
        password: password,
      });

      // Backend vraća KorisnikDTO: { id, username, uloga }
      const userData = response.data;

      // Sačuvamo korisnika i njegovu ulogu iz baze u localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Preusmeravamo na Dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data) {
        // Prikazuje poruku sa bekena: "Neispravno korisničko ime ili lozinka."
        setError(typeof err.response.data === 'string' ? err.response.data : 'Pogrešno korisničko ime ili lozinka.');
      } else {
        setError('Problem sa povezivanjem na server.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Prijava na Studentski Servis</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '12px', padding: '8px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="username">Korisničko ime:</label>
          <input
            id="username"
            type="text"
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">Lozinka:</label>
          <input
            id="password"
            type="password"
            style={{ width: '100%', padding: '8px', marginTop: '4px', boxSizing: 'border-box' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default Login;