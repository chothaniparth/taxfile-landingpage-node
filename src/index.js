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

// Allow static files first
app.use('/', express.static('./media'));

// Helmet config
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
}

// Cookie and body parsers
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// CORS config
app.use(
  cors()
);

// Session config
app.use(
  session({
    name: 'session_id',
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false for localhost
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  })
);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
