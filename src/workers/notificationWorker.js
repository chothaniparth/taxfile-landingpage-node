import pkg from 'bullmq';
import connection from '../Queues/Redis.js';

const { Worker } = pkg;

const worker = new Worker(
  'notificationQueue',
  async job => {
    const { name, token, message } = job.data;
    console.log(`Sending notification to ${name} with token ${token}`);
    console.log(`Message: ${message}`);
  },
  { connection }
);

worker.on('completed', job => console.log(`✅ Job completed: ${job.id}`));
worker.on('failed', (job, err) => console.error(`❌ Job failed: ${job.id}`, err));

console.log('Notification worker is running...');
