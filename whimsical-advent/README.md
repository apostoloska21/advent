# ✨ December Quest - Magical Advent Calendar

A personalized, interactive advent-style web application that delivers daily magical emails with QR codes leading to hidden treasures throughout December.

## 🎯 What It Does

- **Daily Automated Emails**: Sends one magical email every morning at 9 AM during December
- **QR Code Magic**: Each email contains a unique QR code that unlocks a special "Daily Page"
- **Personalized Quests**: Each day features a custom message and riddle leading to a physical gift
- **Magical Experience**: Whimsical UI with animations, fantasy storytelling, and enchanting visuals

## 🧩 Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast development
- **TailwindCSS** + **shadcn/ui** for beautiful UI
- **Framer Motion** for magical animations
- **React Router** for navigation
- **React Query** for data fetching

### Backend & Infrastructure
- **Firebase** (Firestore + Functions + Hosting)
- **Resend API** for email delivery
- **QR Code generation** via API

## 🚀 Quick Setup

### 1. Prerequisites

Make sure you have Node.js installed (v18+). If not, install it:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```

### 2. Clone & Install

```bash
cd "/Users/martina/Documents/project ideas/whimsical/whimsical-advent"
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., "december-quest")
3. Enable Firestore Database
4. Enable Firebase Functions
5. Enable Firebase Hosting

#### Get Your Firebase Config
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Add app" > Web app
4. Copy the config object

### 4. Resend API Setup

#### Create Resend Account
1. Go to [Resend](https://resend.com/)
2. Create an account and verify your email
3. Go to API Keys and create a new API key

#### Configure Domain (Important!)
1. In Resend dashboard, go to Domains
2. Add and verify a domain you own (or use a subdomain)
3. Update the `from` email in the Firebase Function to use your verified domain

### 5. Environment Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Email Configuration
VITE_RESEND_API_KEY=your_resend_api_key_here
RECIPIENT_EMAIL=kimkang2355@gmail.com
```

**Important**: The recipient email should be the email address of the person receiving the advent calendar (your boyfriend).

### 6. Deploy Firebase Functions

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select: Functions, Firestore, Hosting
# Choose your project
# Select TypeScript for functions

# Set environment variables for functions
firebase functions:config:set \
  resend.api_key="your_resend_api_key" \
  advent.recipient_email="kimkang2355@gmail.com" \
  advent.base_url="https://your-project.web.app"

# Deploy functions
firebase deploy --only functions
```

### 7. Seed the Database

Run the seeding script to populate Firestore with 31 days of magical content:

```typescript
// In your browser console or create a temporary script
import { seedDatabase } from './src/scripts/seedDatabase';
seedDatabase();
```

### 8. Deploy the App

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## 🎨 Customization

### Personalizing the Messages

Edit the magical messages and clues in `src/data/seedData.ts`:

```typescript
{
  day: 1,
  message: "Your custom magical greeting...",
  clue: "Your personalized treasure clue..."
}
```

### Styling

The app uses TailwindCSS. Customize colors and animations in:
- `src/index.css` - Global styles and CSS variables
- Component files - Individual component styling

### Email Templates

Customize the email HTML template in `functions/src/index.ts` in the `generateEmailHtml` function.

## 📧 Email Flow

1. **Daily Schedule**: Firebase Function runs every morning at 9 AM
2. **Date Check**: Only sends emails in December (1-31)
3. **Content Fetch**: Retrieves the day's message from Firestore
4. **QR Generation**: Creates a QR code linking to `/day/{number}`
5. **Email Send**: Uses Resend API to send beautiful HTML email
6. **Logging**: Records successful/failed sends in Firestore

## 🔐 Security & Access Control

- **Date Locking**: Days only unlock on their corresponding dates
- **December Only**: App only functions during December
- **Environment Variables**: All sensitive data stored securely
- **Firestore Security**: Configure Firestore rules for read-only access

## 🎭 User Experience

### Home Page (`/`)
- Magical welcome screen
- Explains the quest concept
- Shows current date/status

### Daily Pages (`/day/{1-31}`)
- **Locked State**: Shows mystical "not yet unlocked" message
- **Unlocked State**: Displays magical message and treasure clue
- Beautiful animations and fantasy styling

### Email Experience
- HTML emails with embedded QR codes
- Fantasy-themed design
- Mobile-responsive

## 🛠 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Database Schema

### Collections

#### `days`
```typescript
{
  id: string;
  day: number; // 1-31
  message: string;
  clue: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `emailLogs`
```typescript
{
  id: string;
  dayId: string;
  recipientEmail: string;
  sentAt: Timestamp;
  status: 'sent' | 'failed' | 'pending';
  qrCodeUrl: string;
  errorMessage?: string;
}
```

## 🎨 Design Philosophy

- **Magical & Whimsical**: Fantasy-inspired design with sparkles and animations
- **Personal & Intimate**: Custom messages and personalized experience
- **Accessible**: Mobile-first, easy QR code scanning
- **Emotional**: Focus on wonder, love, and magical discovery

## 🐛 Troubleshooting

### Common Issues

1. **Emails not sending**: Check Firebase Functions logs and Resend API key
2. **QR codes not working**: Verify the deployed URL in Firebase config
3. **Days not unlocking**: Check system date and timezone settings
4. **Styling issues**: Ensure TailwindCSS is properly configured

### Debug Commands

```bash
# Check Firebase functions logs
firebase functions:log

# Test functions locally
firebase emulators:start

# Check Firestore data
# Use Firebase Console > Firestore
```

## 🌟 Future Enhancements

- [ ] Push notifications for unlocked days
- [ ] Photo clues and image support
- [ ] Customizable themes and colors
- [ ] Progress tracking and statistics
- [ ] Multiple language support
- [ ] Admin dashboard for content management

## 📄 License

This project is created with love for magical December adventures. Feel free to adapt and use for your own enchanted quests!

---

**Made with ❤️ and ✨ for creating magical memories**