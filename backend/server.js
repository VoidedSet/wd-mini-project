require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.path);
  next();
});

app.use('/api/users', require('./routes/UserRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//if app.use(express.json()) is missing, req.body will be undefined
//this is the main server file that sets up the Express app 
// connects to the database
// and defines middleware and routes