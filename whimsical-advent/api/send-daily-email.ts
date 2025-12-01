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

// Import seed data
const adventDaysData = [
  {
    day: 1,
    message: "🌟 Dear wandering soul, the December spirits have awakened! Today marks the beginning of your enchanted quest. May the ancient magic guide your heart through this mystical month.",
    clue: "Seek the warmth where morning light first dances - in the sacred chamber where dreams begin their journey."
  },
  {
    day: 2,
    message: "✨ Beloved adventurer, the crystal caverns whisper secrets of joy. Each step you take weaves golden threads of wonder through the tapestry of December.",
    clue: "Follow the silver trail to the throne of comfort, where cushions cradle weary travelers from their daily quests."
  },
  {
    day: 3,
    message: "🌙 Mystical traveler, the moon's gentle glow illuminates hidden paths. Your journey through December's enchanted forest has only just begun, filled with magic yet to unfold.",
    clue: "Ascend to the tower where knowledge resides, amidst shelves that hold the wisdom of countless worlds."
  },
  {
    day: 4,
    message: "🪄 Enchanted one, the fairies of December dance in celebration! Your presence brings light to the darkest corners of this magical realm.",
    clue: "Journey to the crystal sanctuary where reflections reveal hidden truths, a portal between worlds."
  },
  {
    day: 5,
    message: "🌺 Lotus keeper, your heart blooms like a flower in December's nurturing soil. The ancient magic of love surrounds you always.",
    clue: "Find solace in the chamber of flames, where eternal warmth guards against winter's chill embrace."
  },
  {
    day: 6,
    message: "⭐ Celestial wanderer, the stars align in your favor this December morn. The universe conspires to bring you treasures beyond imagination.",
    clue: "Seek the sacred texts in the chamber of ancient wisdom, where stories of heroes are carefully preserved."
  },
  {
    day: 7,
    message: "🌈 Rainbow spirit, your journey paints the sky with colors unseen. December's magic flows through you like a river of liquid starlight.",
    clue: "Venture to the garden of earthly delights, where nature's bounty awaits the fortunate explorer."
  },
  {
    day: 8,
    message: "🦋 Butterfly dreamer, your wings carry you through December's gentle breezes. Each flutter creates ripples of magic in the pond of time.",
    clue: "Discover the hidden realm beneath the waves of daily routine, where treasures lie in wait."
  },
  {
    day: 9,
    message: "🌺 Blossom keeper, your spirit flowers in December's gentle light. Each petal of your journey holds infinite possibility.",
    clue: "Climb to the highest peak where the world spreads out before you, offering panoramic views of possibility."
  },
  {
    day: 10,
    message: "💫 Cosmic traveler, the universe sings your name this December day. Your quest continues through realms both seen and unseen.",
    clue: "Enter the chamber where melodies are born, a sanctuary of sound and rhythm."
  },
  {
    day: 11,
    message: "🌿 Forest guardian, the ancient trees whisper blessings upon you. December's wisdom flows through their ancient roots into your soul.",
    clue: "Find the sacred space where memories are preserved, a gallery of life's precious moments."
  },
  {
    day: 12,
    message: "🦄 Unicorn rider, your path is illuminated by December's magical light. Each step reveals new wonders in this enchanted journey.",
    clue: "Seek the realm of liquid refreshment, where clarity and purity await the thirsty traveler."
  },
  {
    day: 13,
    message: "🌙 Lunar guardian, the moon's wisdom illuminates your path. December's deepest magic flows through you tonight.",
    clue: "Venture to the hearth of home, where warmth and welcome embrace all who enter."
  },
  {
    day: 14,
    message: "❤️ Love's messenger, December's heart beats in rhythm with yours. The magic of connection flows through every moment of your quest.",
    clue: "Find the hidden chamber where fabrics of comfort are stored, soft and inviting."
  },
  {
    day: 15,
    message: "🌟 Star whisperer, the celestial bodies align to celebrate your journey. December's magic intensifies with each passing day.",
    clue: "Seek the elevated sanctuary where rest and contemplation provide peaceful refuge."
  },
  {
    day: 16,
    message: "🦅 Eagle spirit, soar through December's boundless skies. Your vision pierces the veil between worlds, revealing hidden treasures.",
    clue: "Enter the domain of aromatic wonders, where scents tell stories of distant lands."
  },
  {
    day: 17,
    message: "🌊 Ocean dreamer, waves of December magic carry you forward. Each crest brings new discoveries in this endless adventure.",
    clue: "Find the sacred ground where feet meet earth, a foundation of strength and stability."
  },
  {
    day: 18,
    message: "🔮 Crystal seer, December's mysteries unfold before your eyes. The ancient magic reveals itself in moments of quiet wonder.",
    clue: "Venture to the chamber of liquid illumination, where clarity shines through."
  },
  {
    day: 19,
    message: "🌺 Blossom keeper, your spirit flowers in December's gentle light. Each petal of your journey holds infinite possibility.",
    clue: "Seek the elevated platform where stories unfold, a stage for life's grand performance."
  },
  {
    day: 20,
    message: "🦋 Winged wonder, December's breezes lift you higher. Your transformation continues through this magical metamorphosis.",
    clue: "Find the sacred circle where meals become ceremonies of connection and nourishment."
  },
  {
    day: 21,
    message: "🌙 Lunar guardian, the moon's wisdom illuminates your path. December's deepest magic flows through you tonight.",
    clue: "Enter the realm of frozen treasures, where winter's bounty is carefully preserved."
  },
  {
    day: 22,
    message: "⭐ Constellation keeper, stars align in celebration of your quest. The universe itself cheers your December journey.",
    clue: "Seek the chamber where garments of comfort hang, ready to embrace the wearer."
  },
  {
    day: 23,
    message: "🌈 Aurora spirit, December's lights dance in your honor. Your magic creates ripples through the fabric of reality.",
    clue: "Find the sacred space where water's healing power flows freely and abundantly."
  },
  {
    day: 24,
    message: "🎄 Yule messenger, the ancient spirits gather to celebrate. Your December quest reaches its magical crescendo tonight.",
    clue: "Venture to the heart of celebration, where evergreen magic fills the air with wonder."
  },
  {
    day: 25,
    message: "🎁 Gift bearer, December's greatest magic unfolds today. Your journey through this enchanted month has been a masterpiece of wonder.",
    clue: "Seek the throne of comfort where relaxation reigns supreme, a kingdom of cushions and ease."
  },
  {
    day: 26,
    message: "🌟 Afterglow keeper, December's magic lingers like morning mist. Your adventure continues through these precious remaining days.",
    clue: "Find the chamber where entertainment resides, a portal to worlds of imagination."
  },
  {
    day: 27,
    message: "🦉 Wisdom owl, December's ancient knowledge flows through you. Each moment holds the potential for magical discovery.",
    clue: "Seek the sacred ground where movement begins and ends, a foundation for every journey."
  },
  {
    day: 28,
    message: "🌙 Dream weaver, December's final mysteries unfold. Your quest has woven a tapestry of extraordinary magic.",
    clue: "Enter the realm of cleansing waters, where renewal and refreshment await."
  },
  {
    day: 29,
    message: "⭐ Final star, December's constellation completes its dance. Your magical journey approaches its breathtaking conclusion.",
    clue: "Find the elevated sanctuary of slumber, where dreams take flight on wings of comfort."
  },
  {
    day: 30,
    message: "🌟 Eternal flame, December's magic burns brightly within you. Your quest has illuminated the path for countless others.",
    clue: "Seek the chamber where stories are told, a library of life's grand adventures."
  },
  {
    day: 31,
    message: "🎊 Celebration spirit, December's grand finale arrives! Your magical quest concludes with fireworks of wonder and joy. May the magic you discovered continue to light your path through the coming year.",
    clue: "Find the ultimate sanctuary where all paths converge, the heart of home itself."
  }
];

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
const resend = new Resend(process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY);

// Function to seed database with advent days
async function seedDatabaseIfNeeded() {
  console.log('🔍 Checking if database needs seeding...');

  try {
    const daysRef = collection(db, 'days');
    const allDaysQuery = query(daysRef);
    const allDaysSnapshot = await getDocs(allDaysQuery);

    if (allDaysSnapshot.size === 0) {
      console.log('📝 Database is empty, seeding with advent days...');

      for (const dayData of adventDaysData) {
        console.log(`Creating day ${dayData.day}...`);
        await addDoc(collection(db, 'days'), {
          ...dayData,
          isActive: false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      console.log('✅ Database seeded successfully!');
    } else {
      console.log(`📊 Database already has ${allDaysSnapshot.size} days`);
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET requests for manual testing, POST for cron jobs
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // For manual testing, allow overriding the day
  const testDay = req.query.day ? parseInt(req.query.day as string) : null;

  try {
    console.log('🎄 Starting daily advent email job...');

    // Get current date or use test day
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
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

    // Seed database if needed
    await seedDatabaseIfNeeded();

    // Get the advent day data from Firestore
    console.log(`🔍 Looking for day ${currentDay} in database...`);
    const dayRef = collection(db, 'days');
    const dayQuery = query(dayRef, where('day', '==', currentDay));
    const daySnapshot = await getDocs(dayQuery);

    if (daySnapshot.empty) {
      console.error(`❌ No advent day found for day ${currentDay}`);
      console.log('Available days in database:');
      const allDays = await getDocs(collection(db, 'days'));
      allDays.forEach(doc => {
        console.log(`- Day ${doc.data().day}: ${doc.id}`);
      });
      return res.status(404).json({ error: `No advent day found for day ${currentDay}` });
    }

    const dayDoc = daySnapshot.docs[0];
    const dayData = dayDoc.data() as AdventDay;
    console.log(`✅ Found day ${currentDay}: ${dayData.message.substring(0, 50)}...`);

    // Get recipient email from environment
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.VITE_RECIPIENT_EMAIL;

    if (!recipientEmail) {
      console.error('❌ No recipient email configured');
      console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('EMAIL')));
      return res.status(500).json({ error: 'No recipient email configured' });
    }

    console.log(`📧 Sending email to: ${recipientEmail}`);

    // Generate QR code
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5174';
    const dayUrl = `${baseUrl}/day/${currentDay}`;
    console.log(`🔗 Generated URL for day ${currentDay}: ${dayUrl}`);

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

    // Send email
    console.log('📤 Preparing email...');
    const emailHtml = generateEmailHtml(currentDay, qrCodeDataUrl, dayData.message);

    console.log('📨 Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'December Quest <onboarding@resend.dev>',
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
