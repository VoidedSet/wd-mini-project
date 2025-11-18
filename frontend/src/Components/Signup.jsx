import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      navigate('/portfolio');
    } else {
      alert(data.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Sign up</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
      <button type="submit">Sign up</button>
    </form>
  )
}