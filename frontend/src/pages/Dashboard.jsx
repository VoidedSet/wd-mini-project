import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [market, setMarket] = useState([]);
  const [depositAmt, setDepositAmt] = useState("");
  const [buyQty, setBuyQty] = useState({}); // keyed by ticker
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const [uRes, mRes] = await Promise.all([api.get("/users/me"), api.get("/stocks")]);
      setUser(uRes.data);
      setMarket(mRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to load dashboard");
    }
  };

  useEffect(() => { load(); }, []);

  if (!user) return <div style={{ padding: 24 }}>Loading...</div>;

  const sampleTickers = [
    { ticker: "AAPL", company: "Apple Inc.", price: 150 },
    { ticker: "GOOGL", company: "Alphabet", price: 2800 },
    { ticker: "TSLA", company: "Tesla", price: 750 },
    { ticker: "MSFT", company: "Microsoft", price: 330 },
    { ticker: "INFY", company: "Infosys", price: 25 },
  ];

  const addSamples = async () => {
    setLoading(true);
    try {
      for (const s of sampleTickers) {
        try { await api.post("/stocks/add", s); } catch (e) {  }
      }
      const res = await api.get("/stocks");
      setMarket(res.data);
    } finally { setLoading(false); }
  };

  const deposit = async () => {
    const amt = Number(depositAmt);
    if (!amt || amt <= 0) return alert("Enter valid amount");
    try {
      const res = await api.post("/users/deposit", { amount: amt });
      setUser(res.data);
      setDepositAmt("");
    } catch (err) {
      alert(err.response?.data || "Deposit failed");
    }
  };

  const buy = async (ticker, quantity) => {
    const qty = Number(quantity);
    if (!qty || qty <= 0) return alert("Enter valid quantity");
    try {
      const res = await api.post("/users/buy", { ticker, quantity: qty });
      setUser(res.data);
      const mRes = await api.get("/stocks");
      setMarket(mRes.data);
      setBuyQty(prev => ({ ...prev, [ticker]: "" }));
    } catch (err) {
      alert(err.response?.data || "Buy failed");
    }
  };

  const buyMax = async (ticker, price) => {
    const maxQty = Math.floor(user.amountDeposited / price);
    if (maxQty <= 0) return alert("Insufficient funds");
    await buy(ticker, maxQty);
  };

  const styles = {
    page: { padding: 24, background: "#f7fafc", minHeight: "80vh" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    name: { fontSize: 22, color: "#0f172a" },
    layout: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 },
    card: { padding: 16, borderRadius: 8, background: "#fff", boxShadow: "0 6px 18px rgba(15,23,42,0.04)" },
    marketGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 },
    stockRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
    btn: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#111827", color: "#fff", cursor: "pointer" },
    input: { padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" },
    smallBtn: { padding: "6px 8px", borderRadius: 6, border: "1px solid #e2e8f0", background: "transparent", cursor: "pointer" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.name}>Welcome, {user.name}</div>
          <div style={{ color: "#64748b" }}>Balance: ₹{Number(user.amountDeposited || 0).toFixed(2)}</div>
        </div>
        <div>
          <button style={styles.btn} onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}>Logout</button>
        </div>
      </div>

      <div style={styles.layout}>
        <div style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Deposit</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Amount" style={{ ...styles.input, flex: 1 }} />
            <button onClick={deposit} style={styles.btn}>Deposit</button>
          </div>

          <h3 style={{ marginTop: 18 }}>Your Holdings</h3>
          {(!user.stocksOwned || user.stocksOwned.length === 0) ? (
            <p style={{ color: "#6b7280" }}>No holdings yet</p>
          ) : (
            user.stocksOwned.map(s => (
              <div key={s.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.ticker}</div>
                  <div style={{ color: "#6b7280", fontSize: 13 }}>{s.quantity} shares {s.avgPrice ? `(avg ₹${Number(s.avgPrice).toFixed(2)})` : ""}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Market</h3>
            <button onClick={addSamples} style={styles.smallBtn}>Add sample tickers</button>
          </div>

          <div style={styles.marketGrid}>
            {market.map(s => (
              <div key={s.ticker} style={styles.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.ticker}</div>
                    <div style={{ color: "#6b7280", fontSize: 13 }}>{s.company || "—"}</div>
                  </div>
                  <div style={{ color: "#065f46", fontWeight: 700 }}>₹{s.price}</div>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    placeholder="Qty"
                    value={buyQty[s.ticker] || ""}
                    onChange={e => setBuyQty(prev => ({ ...prev, [s.ticker]: e.target.value }))}
                    style={{ ...styles.input, width: 100 }}
                  />
                  <button onClick={() => buy(s.ticker, buyQty[s.ticker])} style={styles.smallBtn}>Buy</button>
                  <button onClick={() => buyMax(s.ticker, s.price)} style={styles.smallBtn}>Buy max</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

//We have used useState for:
//user data, market data, deposit amount, and quantities. When state changes, the component re-renders.
//await makes async code cleaner, more readable, and easier to handle with try-catch.
