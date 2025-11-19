// ...existing code...
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await api.post("/users/signup", form);
      alert("Signup Successful. Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data || "Signup failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input placeholder="Password" type="password" onChange={e => setForm({...form, password:e.target.value})} />
      <button onClick={submit}>Signup</button>
    </div>
  );
}
// ...existing code...