// ...existing code...
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={{ padding: 12, background: "#111827", color: "#fff", display: "flex", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>StockApp</Link>
      </div>

      {token ? (
        <>
          <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
          <Link to="/stocks" style={{ color: "#fff" }}>Stocks</Link>
          <button onClick={logout} style={{ marginLeft: 12 }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/" style={{ color: "#fff" }}>Login</Link>
          <Link to="/signup" style={{ color: "#fff", marginLeft: 12 }}>Signup</Link>
        </>
      )}
    </nav>
  );
}
// ...existing code...