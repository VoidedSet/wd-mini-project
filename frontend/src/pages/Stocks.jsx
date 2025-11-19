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
      // backend buy endpoint lives under /users/buy
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
      // sell endpoint is /stocks/sell (backend)
      await api.post("/stocks/sell", { ticker: trade.ticker.toUpperCase(), quantity: Number(trade.quantity) });
      alert("Sold");
      setTrade({ ticker: "", quantity: 0 });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Sell failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Stocks</h2>

      {stocks.map(s => (
        <p key={s._id}>{s.ticker} — ₹{s.price}</p>
      ))}

      <h3>Trade</h3>
      <input placeholder="Ticker" value={trade.ticker} onChange={e => setTrade({...trade, ticker: e.target.value.toUpperCase()})} />
      <input placeholder="Quantity" value={trade.quantity} onChange={e => setTrade({...trade, quantity: Number(e.target.value)})} />

      <button onClick={buy} disabled={loading}>Buy</button>
      <button onClick={sell} disabled={loading} style={{ marginLeft: 8 }}>Sell</button>
    </div>
  );
}
