import type { VercelRequest, VercelResponse } from '@vercel/node';

// Advent days data (inline to avoid import issues in Vercel)
const adventDaysData = [
  { day: 1, message: "A gentle sparkle marks the beginning of your December quest.", clue: "Look where mornings usually begin." },
  { day: 2, message: "Magic grows stronger today—follow the whispering lights.", clue: "Search somewhere warm and cozy." },
  { day: 3, message: "A soft glow leads you closer to hidden wonders.", clue: "Check a place where you keep your favorite snacks." },
  { day: 4, message: "The magic hums softly today, waiting to be found.", clue: "Look near your phone chargers." },
  { day: 5, message: "A shimmering trail appears only for the brave.", clue: "Search a pocket of your jacket." },
  { day: 6, message: "The air tingles with quiet enchantment.", clue: "Look under your pillow." },
  { day: 7, message: "Today feels like a good day for a small discovery.", clue: "Check inside your favorite shoes." },
  { day: 8, message: "Magic circles around you like a warm breeze.", clue: "Search inside your backpack." },
  { day: 9, message: "A faint glow dances at the corner of your vision.", clue: "Look inside the cutlery drawer." },
  { day: 10, message: "Your quest deepens with quiet courage.", clue: "Search near your computer keyboard." },
  { day: 11, message: "A warm spark reminds you of love and little surprises.", clue: "Check behind your mirror." },
  { day: 12, message: "Mid-December magic glows softly today.", clue: "Look inside your wardrobe." },
  { day: 13, message: "A playful sparkle skips ahead of you.", clue: "Check the fridge door shelves." },
  { day: 14, message: "The magic is preparing something sweet.", clue: "Look near your favorite mug." },
  { day: 15, message: "You are halfway through the enchanted journey.", clue: "Check your coat hanger." },
  { day: 16, message: "The magic hums like a lullaby today.", clue: "Look inside the bathroom drawer." },
  { day: 17, message: "A spark of adventure lights up the evening.", clue: "Check your bedside table." },
  { day: 18, message: "The winds of December whisper your name.", clue: "Look under the couch cushions." },
  { day: 19, message: "A soft glow guides you through the cold.", clue: "Check inside the oven (while it's off!)." },
  { day: 20, message: "Magic curls around you like a winter scarf.", clue: "Look near your skincare products." },
  { day: 21, message: "The solstice energy brings powerful magic.", clue: "Check behind your TV." },
  { day: 22, message: "A soft jingle hints at today's treasure.", clue: "Look near your headphones." },
  { day: 23, message: "The air sparkles—something exciting is near.", clue: "Check your bag or purse." },
  { day: 24, message: "Christmas Eve glimmers with enchantment.", clue: "Look near your favorite candle." },
  { day: 25, message: "A day full of warmth, magic, and love.", clue: "Check under the Christmas tree." },
  { day: 26, message: "The magic isn't done yet… a new trail appears.", clue: "Look near your laptop charger." },
  { day: 27, message: "A soft shimmer says hello this morning.", clue: "Check inside a book you love." },
  { day: 28, message: "Magic lingers like a warm memory.", clue: "Look inside a kitchen cabinet." },
  { day: 29, message: "A glowing spark follows you gently.", clue: "Check your drawer of socks." },
  { day: 30, message: "The year's magic gathers in one last swirl.", clue: "Look near your perfumes or colognes." },
  { day: 31, message: "A final whisper of wonder closes your December quest.", clue: "Check where you keep your notebooks." }
];

// EmailJS configuration (same as test-email.js)
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_xvvuuis';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_kq93r1e';
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || 'vzkwVpMTyWf-wppGa';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'PdSJ5Wc9LopG5hEscfqy-';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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
      // Test URL generation
      const testDay = req.query.day ? parseInt(req.query.day as string) : 1;
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://advent-eta.vercel.app/';
      const testDayUrl = `${baseUrl}/day/${testDay}`;

      return res.status(200).json({
        message: 'Email API is working!',
        urlTest: {
          day: testDay,
          websiteUrl: baseUrl,
          dayUrl: testDayUrl
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
          },
          emailjsConfig: {
            serviceId: EMAILJS_SERVICE_ID,
            templateId: EMAILJS_TEMPLATE_ID,
            publicKey: EMAILJS_PUBLIC_KEY.substring(0, 8) + '...',
            hasPrivateKey: !!EMAILJS_PRIVATE_KEY,
            usingEnvVars: {
              serviceId: !!process.env.EMAILJS_SERVICE_ID,
              templateId: !!process.env.EMAILJS_TEMPLATE_ID,
              publicKey: !!process.env.EMAILJS_PUBLIC_KEY,
              privateKey: !!process.env.EMAILJS_PRIVATE_KEY
            }
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
    console.log(`📊 Advent days data loaded: ${adventDaysData ? adventDaysData.length : 0} days`);
    
    if (!adventDaysData || adventDaysData.length === 0) {
      console.error('❌ Advent days data not loaded!');
      return res.status(500).json({ error: 'Advent days data not available' });
    }
    
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

    // Get website URLs
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://advent-eta.vercel.app/';
    const dayUrl = `${baseUrl}/day/${currentDay}`;
    console.log(`🌐 Base URL: ${baseUrl}`);
    console.log(`📅 Day URL: ${dayUrl}`);

    console.log('📨 Sending email via EmailJS...');

    try {
      // EmailJS server-side sending using REST API
      const websiteUrl = baseUrl;
      const dayPageUrl = dayUrl;
      
      // Format message with link included
      const messageWithLink = `${dayData.message}\n\n🔗 Visit your quest: ${websiteUrl}\n📅 Today's quest: ${dayPageUrl}`;
      
      const templateParams = {
        to_email: recipientEmail,
        from_name: 'December Quest',
        subject: `Day ${currentDay} - December Quest`,
        day: currentDay.toString(),
        message: dayData.message,
        message_with_link: messageWithLink,
        clue: dayData.clue,
        website_url: websiteUrl,
        day_url: dayPageUrl
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
        console.log('🔍 Debug Info:', {
          serviceId: EMAILJS_SERVICE_ID,
          templateId: EMAILJS_TEMPLATE_ID,
          publicKey: EMAILJS_PUBLIC_KEY.substring(0, 8) + '...',
          hasPrivateKey: !!EMAILJS_PRIVATE_KEY
        });
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
    // Catch any errors during initialization or early execution (GET requests, etc.)
    console.error('❌ Fatal error in email handler:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({
      error: 'Server error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
      type: 'FUNCTION_INVOCATION_FAILED'
    });
  }
}

