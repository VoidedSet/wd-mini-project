import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });
    const data = await res.json();
    if (data.success) {
      alert('Signup successful! Please login.');
      navigate('/login');
    } else {
      alert(data.message || 'Signup failed');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Sign Up</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="mb-2">
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        </div>
        <button className="btn btn-primary" type="submit">Sign Up</button>
      </form>
    </div>
  );
}