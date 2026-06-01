const { Resend } = require('resend');
const resend = new Resend('re_DB6rP8vr_JMrderWRv2vDSXxNRpdfFePB');

async function run() {
  console.log('Sending to unverified external email...');
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'test@example.com',
    subject: 'External Test Email',
    html: '<p>Testing sandbox restrictions.</p>'
  });
  
  if (error) {
    console.error('Resend Error:', error);
  } else {
    console.log('Resend Success:', data);
  }
}

run().catch(console.error);
