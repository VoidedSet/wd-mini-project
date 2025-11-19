import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me", {
      headers: { Authorization: localStorage.getItem("token") }
    }).then(res => setUser(res.data));
  }, []);

  if (!user) return "Loading...";

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name}</h2>
      <p>Amount Deposited: ₹{user.amountDeposited}</p>

      <h3>Your Stocks</h3>
      {user.stocksOwned.map(s => (
        <p key={s.ticker}>{s.ticker} — {s.quantity} shares</p>
      ))}

      <h3>Login History</h3>
      {user.loginHistory.map((l, i) => (
        <p key={i}>{new Date(l.loginAt).toLocaleString()}</p>
      ))}
    </div>
  );
}
