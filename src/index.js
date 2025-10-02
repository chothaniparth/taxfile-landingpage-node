import express from 'express';
import dotenv from 'dotenv';
import routes from './routers/index.js';
// const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/api', routes);

// connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
