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
- **Vercel Functions** (Node.js) for serverless API
- **Resend API** for email delivery
- **QR Code generation** via API
- **Static data** for advent content

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

### 3. Static Data Setup

No database setup required! The advent calendar uses static data that is included with the application.

### 4. EmailJS Setup

#### Create EmailJS Account & Configure
1. Go to [EmailJS](https://www.emailjs.com/)
2. Create an account and sign in
3. Go to **Email Services** → **Add New Service**
4. Connect your email provider (Gmail, Outlook, etc.)
5. Copy the **Service ID**

#### Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Use these template variables:
   ```
   {{to_email}} - Recipient email
   {{from_name}} - "December Quest"
   {{subject}} - Email subject
   {{message}} - The magical message
   {{qr_code}} - QR code URL
   {{day}} - Day number
   {{html}} - Full HTML content
   ```
3. Copy the **Template ID**

#### Your Keys (Already Provided):
- **Public Key**: `vzkwVpMTyWf-wppGa`
- **Private Key**: `PdSJ5Wc9LopG5hEscfqy-`

### 5. Environment Configuration

Create a `.env` file in the root directory:

```env
# EmailJS Configuration - REQUIRED
EMAILJS_SERVICE_ID=your_service_id_from_emailjs
EMAILJS_TEMPLATE_ID=your_template_id_from_emailjs
EMAILJS_PUBLIC_KEY=vzkwVpMTyWf-wppGa
EMAILJS_PRIVATE_KEY=PdSJ5Wc9LopG5hEscfqy-

# Recipient Email
RECIPIENT_EMAIL=aleksandarmiloseski96@gmail.com

# App URL for QR code generation (use your deployed URL)
VITE_APP_URL=https://your-advent-app.vercel.app

# Vercel (auto-set in production)
VERCEL_URL=https://your-app.vercel.app
```

**Important**: The recipient email should be the email address of the person receiving the advent calendar (your boyfriend).

### 6. Development Testing

```bash
# Start development server
npm run dev

# The database will be automatically seeded on first run
# Visit http://localhost:5175 to see the app
```

### 7. Deploy to Vercel

#### Option A: Automatic Deployment

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository

2. **Environment Variables** (in Vercel dashboard):
   ```
   # Email
   VITE_RESEND_API_KEY=your_resend_api_key
   RECIPIENT_EMAIL=kimkang2355@gmail.com
   ```

3. **Deploy**: Vercel will automatically build and deploy your app

#### Option B: Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_HOST
vercel env add DATABASE_PORT
vercel env add DATABASE_USER
vercel env add DATABASE_PASSWORD
vercel env add DATABASE_NAME
vercel env add VITE_RESEND_API_KEY
vercel env add RECIPIENT_EMAIL
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

## 📊 Data Structure

### Static Advent Data

The advent calendar uses static data stored in `src/data/seedData.ts`:

```typescript
export const adventDaysData: AdventDayData[] = [
  {
    day: 1,
    message: "🌟 Dear wandering soul...",
    clue: "Seek the warmth where morning light first dances..."
  },
  // ... 31 days of magical content
];
```

## 🎨 Design Philosophy

- **Magical & Whimsical**: Fantasy-inspired design with sparkles and animations
- **Personal & Intimate**: Custom messages and personalized experience
- **Accessible**: Mobile-first, easy QR code scanning
- **Emotional**: Focus on wonder, love, and magical discovery

## 🐛 Troubleshooting

### Common Issues

1. **Emails not sending**: Check Vercel function logs and Resend API key
2. **Days not unlocking**: Check system date and timezone settings
3. **Styling issues**: Ensure TailwindCSS is properly configured

### Debug Commands

```bash
# Check Vercel function logs
# Go to Vercel dashboard > Functions tab

# Check static data
# View src/data/seedData.ts for advent content
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