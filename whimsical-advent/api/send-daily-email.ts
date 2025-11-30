import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import * as QRCode from 'qrcode';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';

interface AdventDay {
  id: string;
  day: number;
  message: string;
  clue: string;
  isActive: boolean;
}

interface EmailLog {
  dayId: string;
  recipientEmail: string;
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
  qrCodeUrl: string;
  errorMessage?: string;
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests (cron jobs)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🎄 Starting daily advent email job...');

    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = now.getDate();

    // Only run in December
    if (currentMonth !== 12) {
      console.log('Not December yet, skipping email send');
      return res.status(200).json({ message: 'Not December yet, skipping email send' });
    }

    // Check if we're within December 1-31
    if (currentDay < 1 || currentDay > 31) {
      console.log('Not a valid advent day, skipping email send');
      return res.status(200).json({ message: 'Not a valid advent day, skipping email send' });
    }

    // Get the advent day data from Firestore
    const dayRef = collection(db, 'days');
    const dayQuery = query(dayRef, where('day', '==', currentDay));
    const daySnapshot = await getDocs(dayQuery);

    if (daySnapshot.empty) {
      console.error(`No advent day found for day ${currentDay}`);
      return res.status(404).json({ error: `No advent day found for day ${currentDay}` });
    }

    const dayDoc = daySnapshot.docs[0];
    const dayData = dayDoc.data() as AdventDay;

    // Get recipient email from environment
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!recipientEmail) {
      console.error('No recipient email configured');
      return res.status(500).json({ error: 'No recipient email configured' });
    }

    // Generate QR code
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-advent-app.vercel.app';
    const dayUrl = `${baseUrl}/day/${currentDay}`;

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(dayUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D3748',
        light: '#FFFFFF'
      }
    });

    // Send email
    const emailHtml = generateEmailHtml(currentDay, qrCodeDataUrl, dayData.message);

    const { data, error } = await resend.emails.send({
      from: 'December Quest <quest@yourdomain.com>',
      to: recipientEmail,
      subject: `🌟 Your December ${currentDay} Magical Quest Awaits!`,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      // Log the failed email attempt
      await logEmailAttempt(currentDay, recipientEmail, 'failed', qrCodeDataUrl, error.message);
      return res.status(500).json({ error: `Failed to send email: ${error.message}` });
    }

    // Log successful email send
    await logEmailAttempt(currentDay, recipientEmail, 'sent', qrCodeDataUrl);

    // Update the day to be active
    const dayDocRef = doc(db, 'days', dayDoc.id);
    await updateDoc(dayDocRef, {
      isActive: true,
      updatedAt: Timestamp.now()
    });

    console.log(`✅ Successfully sent advent email for day ${currentDay} to ${recipientEmail}`);
    return res.status(200).json({
      success: true,
      emailId: data?.id,
      message: `Email sent for day ${currentDay}`
    });

  } catch (error) {
    console.error('❌ Error in sendDailyAdventEmail function:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

function generateEmailHtml(day: number, qrCodeUrl: string, message: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your December ${day} Magical Quest</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2d3748;
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }
          .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .magical-title {
            font-size: 28px;
            color: #4a5568;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .day-indicator {
            font-size: 18px;
            color: #718096;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .qr-section {
            text-align: center;
            margin: 30px 0;
          }
          .qr-instructions {
            font-size: 14px;
            color: #718096;
            margin-bottom: 20px;
            font-style: italic;
          }
          .qr-code {
            max-width: 200px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #a0aec0;
          }
          .sparkles {
            color: #ffd700;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="sparkles">✨🌟✨</div>
            <h1 class="magical-title">December ${day} Quest</h1>
            <div class="day-indicator">Day ${day} of Your Magical Adventure</div>
          </div>

          <div class="message">
            ${message}
          </div>

          <div class="qr-section">
            <p class="qr-instructions">
              Scan this enchanted QR code to unlock today's magical revelation:
            </p>
            <img
              src="${qrCodeUrl}"
              alt="QR Code for Day ${day}"
              class="qr-code"
            />
          </div>

          <div class="footer">
            <p>This magical quest is brought to you by the December spirits ✨</p>
            <p>May your journey be filled with wonder and delight</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

async function logEmailAttempt(
  day: number,
  recipientEmail: string,
  status: 'sent' | 'failed' | 'pending',
  qrCodeUrl: string,
  errorMessage?: string
) {
  try {
    await addDoc(collection(db, 'emailLogs'), {
      dayId: `day-${day}`,
      recipientEmail,
      sentAt: Timestamp.now(),
      status,
      qrCodeUrl,
      errorMessage: errorMessage || null
    });
  } catch (error) {
    console.error('Failed to log email attempt:', error);
  }
}
