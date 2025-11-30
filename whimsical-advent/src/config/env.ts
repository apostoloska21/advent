// Environment configuration
// Replace these with your actual values
export const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBEaPyebuQxsEQIm2FKjEnPwD-qioo5074",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "whimsical-advent.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "whimsical-advent",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "whimsical-advent.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "295484239170",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:295484239170:web:33e8e060e22e2fa0acacdb",
  },
  email: {
    resendApiKey: import.meta.env.VITE_RESEND_API_KEY || "G-QKQE827J34",
    recipientEmail: import.meta.env.RECIPIENT_EMAIL || "aleksandarmiloseski96@gmail.com",
  },
};





