import { Worker } from 'bullmq';
import nodemailer from 'nodemailer';
import { connection } from './emailQueue.js';

// Free fake email account for testing (no signup, no real emails sent)
const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

const worker = new Worker(
  'email-queue',
  async (job) => {
    const { to, subject, body } = job.data;

    const info = await transporter.sendMail({
      from: '"My App" <no-reply@myapp.com>',
      to,
      subject,
      text: body,
    });

    console.log(`Sent to ${to}`);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed: ${err.message}`);
});

console.log('Worker is running...');
