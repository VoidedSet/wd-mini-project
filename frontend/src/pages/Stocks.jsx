import { useEffect, useState } from "react";
import { api } from "../api";

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [trade, setTrade] = useState({ ticker: "", quantity: 0 });

  useEffect(() => {
    api.get("/stocks").then(res => setStocks(res.data));
  }, []);

  const buy = async () => {
    await api.post("/stocks/buy", trade, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    alert("Bought");
  };

  const sell = async () => {
    await api.post("/stocks/sell", trade, {
      headers: { Authorization: localStorage.getItem("token") }
    });
    alert("Sold");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Stocks</h2>

      {stocks.map(s => (
        <p key={s._id}>{s.ticker} — ₹{s.price}</p>
      ))}

      <h3>Trade</h3>
      <input placeholder="Ticker" onChange={e => setTrade({...trade, ticker:e.target.value})} />
      <input placeholder="Quantity" onChange={e => setTrade({...trade, quantity:Number(e.target.value)})} />

      <button onClick={buy}>Buy</button>
      <button onClick={sell}>Sell</button>
    </div>
  );
}
