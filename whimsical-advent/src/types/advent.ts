export interface AdventDay {
  id: string;
  day: number; // 1-31
  message: string; // Magical greeting/story message
  clue: string; // Riddle or clue about where the gift is hidden
  isActive: boolean; // Whether this day is unlocked
  createdAt: Date;
  updatedAt: Date;
}

export interface AdventCalendar {
  id: string;
  title: string;
  description: string;
  startDate: Date; // December 1st
  endDate: Date; // December 31st
  recipientEmail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  dayId: string;
  recipientEmail: string;
  sentAt: Date;
  status: 'sent' | 'failed' | 'pending';
  qrCodeUrl: string;
  errorMessage?: string;
}
