import express from 'express';
import dotenv from 'dotenv';
import routes from './routers/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
// const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());
app.use('/api', routes);

app.use('/', express.static(`./media`));

// connectDB();

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));