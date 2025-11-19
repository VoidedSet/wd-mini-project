import { useEffect, useState } from "react";
import { api } from "../api";

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [trade, setTrade] = useState({ ticker: "", quantity: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/stocks");
      setStocks(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to load stocks");
    }
  };

  useEffect(() => { load(); }, []);

  const buy = async () => {
    if (!trade.ticker || !trade.quantity || Number(trade.quantity) <= 0) return alert("Enter valid ticker and quantity");
    setLoading(true);
    try {
      await api.post("/users/buy", { ticker: trade.ticker.toUpperCase(), quantity: Number(trade.quantity) });
      alert("Bought");
      setTrade({ ticker: "", quantity: 0 });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Buy failed");
    } finally { setLoading(false); }
  };

  const sell = async () => {
    if (!trade.ticker || !trade.quantity || Number(trade.quantity) <= 0) return alert("Enter valid ticker and quantity");
    setLoading(true);
    try {
      await api.post("/stocks/sell", { ticker: trade.ticker.toUpperCase(), quantity: Number(trade.quantity) });
      alert("Sold");
      setTrade({ ticker: "", quantity: 0 });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Sell failed");
    } finally { setLoading(false); }
  };

  const styles = {
    page: { padding: 24, background: "#f7fafc", minHeight: "80vh" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
    title: { fontSize: 28, color: "#0f172a" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 },
    card: { padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 4px 12px rgba(15,23,42,0.04)" },
    ticker: { fontWeight: 700, fontSize: 16, color: "#111827" },
    price: { color: "#065f46", fontWeight: 600, marginTop: 6 },
    tradeBar: { display: "flex", gap: 8, marginTop: 12, alignItems: "center" },
    input: { padding: "8px 10px", borderRadius: 6, border: "1px solid #e2e8f0" },
    btnPrimary: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#0f172a", color: "#fff", cursor: "pointer" },
    btnGhost: { padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "transparent", cursor: "pointer" }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Market</h2>
        <div>
          <input
            placeholder="Ticker"
            value={trade.ticker}
            onChange={e => setTrade({ ...trade, ticker: e.target.value.toUpperCase() })}
            style={{ ...styles.input, marginRight: 8 }}
          />
          <input
            placeholder="Qty"
            value={trade.quantity}
            onChange={e => setTrade({ ...trade, quantity: Number(e.target.value) })}
            style={{ ...styles.input, width: 100, marginRight: 8 }}
          />
          <button onClick={buy} disabled={loading} style={styles.btnPrimary}>Buy</button>
          <button onClick={sell} disabled={loading} style={{ ...styles.btnGhost, marginLeft: 8 }}>Sell</button>
        </div>
      </div>

      <div style={styles.grid}>
        {stocks.map(s => (
          <div key={s._id} style={styles.card}>
            <div style={styles.ticker}>{s.ticker}</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>{s.company || "—"}</div>
            <div style={styles.price}>₹{s.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
