import express from 'express';
import dotenv from 'dotenv';
import routes from './routers/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import crypto from 'crypto';

dotenv.config();

const app = express();

// Basic Security Headers
// app.use(helmet());

// Parse cookies
// app.use(cookieParser());

// Parse body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// Express Session Setup
// app.use(
//   session({
//     name: 'session_id', // cookie name
//     secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true, // Prevent JS access (XSS protection)
//       secure: process.env.NODE_ENV === 'production', // true only for HTTPS
//       sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // for cross-origin cookies
//       maxAge: 1000 * 60 * 60 * 24 * 30, // 30 day
//     },
//   })
// );

app.use('/api', routes);

app.use('/', express.static(`./media`));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));