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

  if (!user) return "Loading...";

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
        try { await api.post("/stocks/add", s); } catch (e) { /* ignore duplicates */ }
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
      // refresh market in case price or other data changed
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name}</h2>
      <p>Amount Deposited: ₹{user.amountDeposited.toFixed(2)}</p>

      <div style={{ margin: "12px 0", padding: 12, border: "1px solid #ddd" }}>
        <h3>Deposit Money</h3>
        <input value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="Amount" />
        <button onClick={deposit} style={{ marginLeft: 8 }}>Deposit</button>
      </div>

      <h3>Market</h3>
      <button onClick={addSamples} disabled={loading}>Add sample tickers</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12, marginTop: 12 }}>
        {market.map(s => (
          <div key={s.ticker} style={{ padding: 12, border: "1px solid #ccc", borderRadius: 6 }}>
            <strong>{s.ticker}</strong> — {s.company} <br />
            Price: ₹{s.price}
            <div style={{ marginTop: 8 }}>
              <input
                placeholder="Qty"
                value={buyQty[s.ticker] || ""}
                onChange={e => setBuyQty(prev => ({ ...prev, [s.ticker]: e.target.value }))}
                style={{ width: 80 }}
              />
              <button onClick={() => buy(s.ticker, buyQty[s.ticker])} style={{ marginLeft: 8 }}>Buy</button>
              <button onClick={() => buyMax(s.ticker, s.price)} style={{ marginLeft: 8 }}>Buy max</button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 20 }}>Your Stocks</h3>
      {(!user.stocksOwned || user.stocksOwned.length === 0) ? (
        <p>No holdings</p>
      ) : (
        user.stocksOwned.map(s => (
          <p key={s.ticker}>
            {s.ticker} — {s.quantity} shares {s.avgPrice ? `(avg ₹${s.avgPrice})` : ""}
          </p>
        ))
      )}

      <h3>Login History</h3>
      {user.loginHistory?.map((l, i) => <p key={i}>{new Date(l.loginAt).toLocaleString()}</p>)}
    </div>
  );
}
