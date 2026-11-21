import { emailQueue } from './emailQueue.js';

const retryOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
};

async function addEmails() {
  // Normal emails: low priority (higher number = lower priority)
  for (let i = 1; i <= 5; i++) {
    await emailQueue.add(
      'send-email',
      {
        to: `user${i}@example.com`,
        subject: 'Hello!',
        body: `This is email number ${i}`,
      },
      { ...retryOptions, priority: 10 },
    );
    console.log(`Added job ${i} (priority 10)`);
  }

  // Urgent email: added last, but priority 1 makes it run first
  await emailQueue.add(
    'password-reset',
    {
      to: 'urgent@example.com',
      subject: 'Reset your password',
      body: 'Click here to reset your password',
    },
    { ...retryOptions, priority: 1 },
  );
  console.log('Added password-reset job (priority 1)');

  // Delayed email: waits 5 seconds before it can be processed
  await emailQueue.add(
    'reminder',
    {
      to: 'later@example.com',
      subject: 'Reminder',
      body: 'This email was delayed by 5 seconds',
    },
    { ...retryOptions, delay: 5000 },
  );
  console.log('Added reminder job (delay 5s)');

  await emailQueue.close();
}

addEmails();
