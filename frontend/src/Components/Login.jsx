import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/portfolio');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="mb-2">
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        </div>
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  )
}