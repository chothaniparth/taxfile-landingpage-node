import express from 'express';
import dotenv from 'dotenv';
import routes from './routers/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import crypto from 'crypto';
import {notificationQueue} from './Queues/queues.js'

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

app.post('/notification-worker', async (req, res) => {
  try {
    const { name, token, message, scheduleAt } = req.body;

    if (!name || !token || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // If scheduling time is provided, calculate delay
    let delay = 0;
    if (scheduleAt) {
      const scheduleTime = new Date(scheduleAt).getTime();
      delay = Math.max(scheduleTime - Date.now(), 0);
    }

    // Add job to queue
    const job = await notificationQueue.add(
      'sendNotification',
      { name, token, message },
      { delay, removeOnComplete: true, removeOnFail: 10 }
    );

    res.status(200).json({
      success: true,
      jobId: job.id,
      message: 'Notification job added to queue successfully.',
    });
  } catch (err) {
    console.error('Error adding job to notification queue:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
