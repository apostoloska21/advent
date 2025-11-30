import { Resend } from 'resend';
import { config } from '@/config/env';

const resend = new Resend(config.email.resendApiKey);

export interface EmailData {
  day: number;
  qrCodeUrl: string;
  recipientEmail: string;
  message: string;
}

export const sendDailyAdventEmail = async (emailData: EmailData) => {
  const { day, qrCodeUrl, recipientEmail, message } = emailData;

  try {
    const emailHtml = `
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

    const { data, error } = await resend.emails.send({
      from: 'December Quest <onboarding@resend.dev>', // Using Resend's verified domain for testing
      to: recipientEmail,
      subject: `🌟 Your December ${day} Magical Quest Awaits!`,
      html: emailHtml,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return {
      success: true,
      emailId: data?.id,
      message: `Email for day ${day} sent successfully to ${recipientEmail}`
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const generateQRCodeUrl = (day: number, baseUrl: string = window.location.origin): string => {
  const dayUrl = `${baseUrl}/day/${day}`;
  // For now, return a placeholder. In production, you'd generate actual QR codes
  // This could be done with a service like QR Code Monkey API or similar
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dayUrl)}`;
};
