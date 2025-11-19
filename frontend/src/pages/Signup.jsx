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

  const styles = {
    page: { display: "flex", alignItems: "center", justifyContent: "center", height: "80vh", background: "#f5f7fb" },
    card: { width: 380, padding: 24, borderRadius: 8, boxShadow: "0 6px 18px rgba(20,20,50,0.06)", background: "#fff" },
    title: { margin: 0, marginBottom: 12, fontSize: 22, color: "#111827" },
    input: { width: "100%", padding: "10px 12px", marginBottom: 10, borderRadius: 6, border: "1px solid #e2e8f0", outline: "none" },
    btn: { width: "100%", padding: "10px 12px", borderRadius: 6, background: "#111827", color: "#fff", border: "none", cursor: "pointer" },
    foot: { marginTop: 12, fontSize: 13, color: "#6b7280", textAlign: "center" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create account</h2>

        <input
          style={styles.input}
          placeholder="Full name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.btn} onClick={submit}>Sign up</button>

        <div style={styles.foot}>
          Already have an account? <span style={{ color: "#111827", cursor: "pointer" }} onClick={() => navigate("/")}>Login</span>
        </div>
      </div>
    </div>
  );
}