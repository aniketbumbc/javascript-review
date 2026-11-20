import { emailQueue } from './emailQueue.js';

async function addEmails() {
  for (let i = 1; i <= 5; i++) {
    await emailQueue.add(
      'send-email',
      {
        to: `user${i}@example.com`,
        subject: 'Hello!',
        body: `This is email number ${i}`,
      },

      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
    console.log(`Added job ${i}`);
  }

  await emailQueue.close();
}

addEmails();
