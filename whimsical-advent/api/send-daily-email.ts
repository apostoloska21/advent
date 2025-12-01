import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as QRCode from 'qrcode';
import adventDaysData from '../src/assets/data.json';

// EmailJS configuration (same as test-email.js)
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_xvvuuis';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_kq93r1e';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'vzkwVpMTyWf-wppGa';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'PdSJ5Wc9LopG5hEscfqy-';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET requests for manual testing, POST for cron jobs
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle GET requests for testing
  if (req.method === 'GET') {
    // If test=true is provided, actually send the email
    if (req.query.test === 'true') {
      console.log('🧪 Manual email test initiated via GET request');
      // Continue with the normal flow but force the test day
    } else {
      // Test QR code URL generation
      const testDay = req.query.day ? parseInt(req.query.day as string) : 1;
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5174';
      const testQrUrl = `${baseUrl}/day/${testDay}`;

      return res.status(200).json({
        message: 'Email API is working!',
        qrCodeTest: {
          day: testDay,
          generatedUrl: testQrUrl,
          qrCodeApiUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(testQrUrl)}`
        },
        testing: {
          checkStatus: 'GET /api/send-daily-email',
          sendTestEmail: 'GET /api/send-daily-email?test=true&day=1',
          cronJob: 'POST /api/send-daily-email (runs automatically daily at 9 AM UTC)'
        },
        environment: {
          required: ['EMAILJS_PUBLIC_KEY', 'RECIPIENT_EMAIL'],
          status: {
            hasEmailjsKey: !!(process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY),
            hasRecipientEmail: !!(process.env.RECIPIENT_EMAIL || process.env.VITE_RECIPIENT_EMAIL),
            hasVercelUrl: !!process.env.VERCEL_URL,
            baseUrl: baseUrl
          }
        },
        currentTime: new Date().toISOString(),
        currentDay: new Date().getDate(),
        currentMonth: new Date().getMonth() + 1
      });
    }
  }

  // For manual testing, allow overriding the day
  const testDay = req.query.day ? parseInt(req.query.day as string) : null;

  try {
    console.log('🎄 Starting daily advent email job...');

    // Get current date or use test day
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const actualDay = now.getDate();
    const currentDay = testDay || actualDay;

    console.log(`📅 Current date: ${now.toISOString()}, Month: ${currentMonth}, Day: ${actualDay}`);
    if (testDay) {
      console.log(`🧪 Using test day: ${testDay}`);
    }

    // Only run in December (unless testing)
    if (currentMonth !== 12 && !testDay) {
      console.log('Not December yet, skipping email send');
      return res.status(200).json({ message: 'Not December yet, skipping email send' });
    }

    // Check if we're within December 1-31
    if (currentDay < 1 || currentDay > 31) {
      console.log('Not a valid advent day, skipping email send');
      return res.status(200).json({ message: 'Not a valid advent day, skipping email send' });
    }

    // Get the advent day data from static data
    console.log(`🔍 Looking for day ${currentDay} in static data...`);
    const dayData = adventDaysData.find(day => day.day === currentDay);

    if (!dayData) {
      console.error(`❌ No advent day found for day ${currentDay}`);
      return res.status(404).json({ error: `No advent day found for day ${currentDay}` });
    }
    console.log(`✅ Found day ${currentDay}: ${dayData.message.substring(0, 50)}...`);

    // Get recipient email from environment
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.VITE_RECIPIENT_EMAIL;

    if (!recipientEmail) {
      console.error('❌ No recipient email configured');
      console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('EMAIL')));
      return res.status(500).json({ error: 'No recipient email configured' });
    }

    console.log(`📧 Sending email to: ${recipientEmail}`);

    // Generate QR code - ensure it points to the deployed website
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5174';
    const dayUrl = `${baseUrl}/day/${currentDay}`;
    console.log(`🔗 QR Code will link to: ${dayUrl}`);
    console.log(`🌐 Base URL used: ${baseUrl}`);
    console.log(`📅 Day URL: /day/${currentDay}`);

    // Generate QR code as data URL
    console.log('🖼️ Generating QR code...');
    const qrCodeDataUrl = await QRCode.toDataURL(dayUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2D3748',
        light: '#FFFFFF'
      }
    });
    console.log('✅ QR code generated successfully');

    // Send email using EmailJS
    console.log('📤 Preparing email...');
    const emailHtml = generateEmailHtml(currentDay, qrCodeDataUrl, dayData.message);

    console.log('📨 Sending email via EmailJS...');

    try {
      // EmailJS server-side sending using REST API
      const templateParams = {
        to_email: recipientEmail,
        from_name: 'December Quest',
        subject: `🌟 Your December ${currentDay} Magical Quest Awaits!`,
        message: dayData.message,
        qr_code: qrCodeDataUrl,
        day: currentDay.toString(),
        html: emailHtml
      };

      const requestBody = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: templateParams
      };

      console.log('📨 Sending email via EmailJS REST API...');
      console.log('🔧 Service ID:', EMAILJS_SERVICE_ID);
      console.log('📝 Template ID:', EMAILJS_TEMPLATE_ID);
      console.log('🔑 Public Key:', EMAILJS_PUBLIC_KEY.substring(0, 8) + '...');
      console.log('📧 Sending to:', templateParams.to_email);

      // Use EmailJS REST API with server-side access token
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ EmailJS API Response:', response.status, errorText);
        console.log('📨 Request Body Sent:', JSON.stringify(requestBody, null, 2));
        throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
      }

      const result = await response.text();
      console.log(`✅ Successfully sent advent email for day ${currentDay} to ${recipientEmail}`);
      console.log('EmailJS result:', result);

      return res.status(200).json({
        success: true,
        emailId: result || 'sent',
        message: `Email sent for day ${currentDay}`
      });

    } catch (error) {
      console.error('❌ Error sending email via EmailJS:', error);

      // Log error (console only since no database)
      console.log(`❌ Email failed for day ${currentDay} to ${recipientEmail}: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return res.status(500).json({
        error: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

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
