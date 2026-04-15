import sgMail from '@sendgrid/mail';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simple in-memory store (replace with DB like Firestore in production)
const codes = new Map();

// Helper: generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send verification code
const sendCode = async (email) => {
  const code = generateCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
  codes.set(email, { code, expiresAt });

  const msg = {
    to: email,
    from: 'no-reply@yseshlinkr.com', // verified sender
    subject: 'Your Seshlinkr Verification Code',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  };

  await sgMail.send(msg);
};

// Endpoint: resend code
app.post('/auth/resend-email-code', async (req, res) => {
  const { email } = req.body;
  try {
    await sendCode(email);
    res.send({ success: true, message: 'Verification code sent.' });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to send email.' });
  }
});

// Endpoint: verify code
app.post('/auth/verify-email', (req, res) => {
  const { email, code } = req.body;
  const record = codes.get(email);

  if (!record) return res.status(400).send({ message: 'No code found for this email.' });
  if (record.expiresAt < Date.now()) return res.status(400).send({ message: 'Code expired.' });
  if (record.code !== code) return res.status(400).send({ message: 'Invalid code.' });

  // Verified: you can mark user in DB as verified
  codes.delete(email);
  res.send({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
