// ...existing code...
const express = require('express')
const axios = require('axios')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const url = 'mongodb://127.0.0.1:27017';       // local DB
const dbName = 'assignment';            // your DB name
const client = new MongoClient(url);          // local client

const users = [];
const app = express()
const port = process.env.PORT || 3000;

const finnhub_API_KEY = "d4cm7v9r01qudf6ivkpgd4cm7v9r01qudf6ivkq0"
const POLYGON_API_KEY = "RRF8BWx7QKfz66AWUujvhEKR1OMhQkQ5"

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let last;

function formatDate(d) {
    const now = d instanceof Date ? d : new Date(d);
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);

    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const currentDateTime = `${currentDate} ${currentTime}`;
    return { Date: currentDate, Time: currentTime, DateTime: currentDateTime };
}

function getCurrentTime() {
    return formatDate(new Date());
}

function unixToOriginal(unixTimestamp) {
    if (!unixTimestamp && unixTimestamp !== 0) return null;
    return formatDate(new Date(unixTimestamp * 1000));
}

const isMarketOpen = (now, last) => {
    if (!last) return false;
    const curr = new Date(now);
    const lastClosed = new Date(last);

    const differenceInMilliseconds = curr - lastClosed;
    const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

    return differenceInMinutes <= 5;
};

// ----------------- MAIN SERVER FUNCTION -----------------

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected to Local MongoDB!");
        // ...existing code...

const users = [];

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password required' });
    }
    
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.json({ success: true, message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.json({ success: false, message: 'Username and password required' });
    }
    
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.json({ success: false, message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ username }, 'your_jwt_secret');
    res.json({ success: true, token });
});

// ...rest of existing code...
        // GET WATCHLIST (use findOne to avoid items[0] issues)
        app.get('/watchlist', async (req, res) => {
            const watchlistCol = client.db(dbName).collection('watchlist');
            const doc = await watchlistCol.findOne({ userId: 'user1' });
            if (!doc) return res.json([]);
            return res.json(doc.watchlist || []);
        });

        // ADD TO WATCHLIST
        app.post('/watchlist', async (req, res) => {
            const ticker = (req.body.ticker || "").toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker required' });

            const watchlistCol = client.db(dbName).collection('watchlist');
            const doc = await watchlistCol.findOne({ userId: 'user1' });

            if (!doc) {
                const newDoc = { userId: 'user1', watchlist: [{ ...req.body, ticker }] };
                await watchlistCol.insertOne(newDoc);
                return res.json(newDoc);
            }

            const exists = (doc.watchlist || []).some(i => i.ticker === ticker);
            if (exists) return res.json({ status: 'Already present' });

            const result = await watchlistCol.updateOne(
                { userId: 'user1' },
                { $push: { watchlist: { ...req.body, ticker } } }
            );
            res.json(result);
        });

        // DELETE FROM WATCHLIST
        app.post("/deleteWatchlistItem", async (req, res) => {
            const ticker = (req.body.ticker || "").toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker required' });
            const watchlistCol = client.db(dbName).collection('watchlist');
            const result = await watchlistCol.updateOne(
                { userId: 'user1' },
                { $pull: { watchlist: { ticker } } }
            );
            res.json(result);
        });

        // GET PORTFOLIO (use findOne)
        app.get('/portfolio', async (req, res) => {
            const portfolioCol = client.db(dbName).collection('portfolio');
            const doc = await portfolioCol.findOne({ userId: 'user1' });
            if (!doc) return res.json({ current_balance: 0, investments: [] });
            return res.json({
                current_balance: doc.current_balance || 0,
                investments: doc.investments || []
            });
        });

        // DEPOSIT / ADD FUNDS
        app.post('/deposit', async (req, res) => {
            const amount = parseFloat(req.body.amount);
            if (isNaN(amount) || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

            const portfolioCol = client.db(dbName).collection('portfolio');
            const result = await portfolioCol.findOneAndUpdate(
                { userId: 'user1' },
                {
                    $inc: { current_balance: amount },
                    $setOnInsert: { investments: [], userId: 'user1' }
                },
                { upsert: true, returnDocument: 'after' }
            );
            res.json(result.value);
        });

        // BUY STOCK
        app.post('/buy', async (req, res) => {
            let { price, quantity, ticker } = req.body;
            price = parseFloat(price);
            quantity = parseInt(quantity, 10);
            ticker = (ticker || "").toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker required' });
            if (isNaN(price) || isNaN(quantity) || quantity <= 0) return res.status(400).json({ error: 'Invalid price or quantity' });

            const portfolioCol = client.db(dbName).collection('portfolio');
            let doc = await portfolioCol.findOne({ userId: 'user1' });

            if (!doc) {
                await portfolioCol.insertOne({ userId: 'user1', current_balance: 0, investments: [] });
                doc = await portfolioCol.findOne({ userId: 'user1' });
            }

            let investments = doc.investments || [];
            const totalCost = price * quantity;
            let updated = false;

            for (let i = 0; i < investments.length; i++) {
                if (investments[i].ticker === ticker) {
                    investments[i].quantity = (investments[i].quantity || 0) + quantity;
                    investments[i].price = (parseFloat(investments[i].price) || 0) + totalCost;
                    updated = true;
                    break;
                }
            }

            if (!updated) investments.push({ ticker, quantity, price: totalCost });

            const result = await portfolioCol.findOneAndUpdate(
                { userId: 'user1' },
                {
                    $set: { investments },
                    $inc: { current_balance: -totalCost }
                },
                { returnDocument: 'after' }
            );
            res.json(result.value);
        });

        // SELL STOCK
        app.post("/sell", async (req, res) => {
            let { price, quantity, ticker } = req.body;
            price = parseFloat(price);
            quantity = parseInt(quantity, 10);
            ticker = (ticker || "").toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker required' });
            if (isNaN(price) || isNaN(quantity) || quantity <= 0) return res.status(400).json({ error: 'Invalid price or quantity' });

            const portfolioCol = client.db(dbName).collection('portfolio');
            const doc = await portfolioCol.findOne({ userId: 'user1' });

            if (!doc) return res.status(400).json({ error: 'No portfolio found' });

            let investments = doc.investments || [];
            const totalProceeds = price * quantity;

            for (let i = 0; i < investments.length; i++) {
                if (investments[i].ticker === ticker) {
                    investments[i].quantity = (investments[i].quantity || 0) - quantity;
                    investments[i].price = (parseFloat(investments[i].price) || 0) - totalProceeds;
                    if (investments[i].quantity <= 0) investments.splice(i, 1);
                    break;
                }
            }

            const result = await portfolioCol.findOneAndUpdate(
                { userId: 'user1' },
                {
                    $set: { investments },
                    $inc: { current_balance: totalProceeds }
                },
                { returnDocument: 'after' }
            );

            res.json(result.value);
        });

        // BASIC ROUTES + API CALLS
        app.get('/', (req, res) => res.send('Hello World!'));

        app.get('/autocomplete', (req, res) => {
            const q = req.query.query || '';
            if (!q) return res.status(400).json({ error: 'query required' });
            axios.get(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${finnhub_API_KEY}`)
                .then(r => res.json(r.data.result))
                .catch(err => res.status(500).json(err));
        });

        app.get('/summary', (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            const p1 = axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${finnhub_API_KEY}`);
            const p2 = axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhub_API_KEY}`);
            const p3 = axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${ticker}&token=${finnhub_API_KEY}`);
            const p4 = axios.get(`https://api.polygon.io/v1/marketstatus/now?apiKey=${POLYGON_API_KEY}`);

            Promise.all([p1, p2, p3, p4]).then(results => {
                last = unixToOriginal(results[1].data.t);
                res.json({
                    profile: results[0].data,
                    latest_price: results[1].data,
                    peers: results[2].data,
                    marketStatus: results[3].data
                });
            }).catch(err => res.status(500).json(err));
        });

        // SUMMARY CHARTS
        app.get('/summary-charts', (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            const current = getCurrentTime();
            let to_date, from_date;

            if (last && isMarketOpen(current.DateTime, last.DateTime)) {
                to_date = current.Date;
            } else if (last && last.Date) {
                to_date = last.Date;
            } else {
                to_date = current.Date;
            }

            from_date = new Date(to_date);
            from_date.setDate(from_date.getDate() - 1);
            from_date = from_date.toISOString().split('T')[0];

            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/hour/${from_date}/${to_date}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
                .then(r => res.json(r.data))
                .catch(err => res.status(500).json(err));
        });

        // NEWS
        app.get("/news", (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            const current = getCurrentTime();
            let from_date = new Date(current.Date);
            from_date.setDate(from_date.getDate() - 7);
            from_date = from_date.toISOString().split('T')[0];

            axios.get(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from_date}&to=${current.Date}&token=${finnhub_API_KEY}`)
                .then(r => res.json(r.data))
                .catch(err => res.status(500).json(err));
        });

        // BIG CHARTS
        app.get("/charts", (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            const current = getCurrentTime();
            let from_date = new Date(current.Date);
            from_date.setFullYear(from_date.getFullYear() - 2);
            from_date = from_date.toISOString().split('T')[0];

            axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from_date}/${current.Date}?adjusted=true&sort=asc&apiKey=${POLYGON_API_KEY}`)
                .then(r => res.json(r.data))
                .catch(err => res.status(500).json(err));
        });

        // INSIGHTS
        app.get("/insights", (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            const mspr = axios.get(`https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${ticker}&from=2022-01-01&token=${finnhub_API_KEY}`);
            const eps = axios.get(`https://finnhub.io/api/v1/stock/earnings?symbol=${ticker}&token=${finnhub_API_KEY}`);
            const recommendation = axios.get(`https://finnhub.io/api/v1/stock/recommendation?symbol=${ticker}&token=${finnhub_API_KEY}`);

            Promise.all([mspr, eps, recommendation])
                .then(results => res.json({
                    mspr: results[0].data,
                    eps: results[1].data,
                    recommendation: results[2].data
                }))
                .catch(err => res.status(500).json(err));
        });
             // GET CURRENT STOCK PRICE
        app.get('/current_stock_price', (req, res) => {
            const ticker = (req.query.ticker_name || '').toUpperCase();
            if (!ticker) return res.status(400).json({ error: 'ticker_name required' });

            axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${finnhub_API_KEY}`)
                .then(r => res.json(r.data))
                .catch(err => res.status(500).json(err));
        });
        // ----------------- START SERVER -----------------
        app.listen(port, () => {
            console.log(`🚀 Server running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error("❌ Error:", err);
    }
}

run();
// ...existing code...