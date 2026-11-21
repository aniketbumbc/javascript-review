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
    const waitedMs = Date.now() - job.timestamp;
    console.log(
      `Processing ${job.name} (priority ${job.opts.priority ?? 0}) after ${waitedMs}ms`,
    );

    await job.updateProgress(10); // started

    // Simulate a flaky SMTP server: fail ~50% of the time to see retries + backoff
    if (Math.random() < 0.5) {
      throw new Error(`SMTP down (attempt ${job.attemptsMade + 1})`);
    }

    const info = await transporter.sendMail({
      from: '"My App" <no-reply@myapp.com>',
      to,
      subject,
      text: body,
    });

    await job.updateProgress(80); // email sent

    console.log(`Sent to ${to}`);
    console.log(`Preview: ${nodemailer.getTestMessageUrl(info)}`);

    await job.updateProgress(100); // done
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

worker.on('progress', (job, progress) => {
  console.log(`Job ${job.id} (${job.name}) progress: ${progress}%`);
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  const maxAttempts = job.opts.attempts ?? 1;
  const finalFailure = job.attemptsMade >= maxAttempts;
  console.log(
    `Job ${job.id} failed: ${err.message} | attempts ${job.attemptsMade}/${maxAttempts}` +
      (finalFailure ? ' | giving up' : ' | will retry'),
  );
});

console.log('Worker is running...');
