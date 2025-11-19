import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data || "Login failed");
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
        <h2 style={styles.title}>Welcome back</h2>

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

        <button style={styles.btn} onClick={login}>Login</button>

        <div style={styles.foot}>
          New here? <span style={{ color: "#111827", cursor: "pointer" }} onClick={() => navigate("/signup")}>Create account</span>
        </div>
      </div>
    </div>
  );
}