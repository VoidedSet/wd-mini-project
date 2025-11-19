require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

// configure CORS for your frontend
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
};
app.use(cors(corsOptions));
// respond to preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

// optional request logger to verify incoming requests
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

// mount routes (keep these after cors and json middleware)
app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
