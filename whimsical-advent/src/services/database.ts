// Static data-based operations (no database)

import { adventDaysData } from '@/data/seedData';

export interface AdventDay {
  day: number;
  message: string;
  clue: string;
}

// Days operations using static data
export const getDay = async (dayId: number): Promise<AdventDay | null> => {
  const day = adventDaysData.find(d => d.day === dayId);
  return day || null;
};

export const getDayByNumber = async (dayNumber: number): Promise<AdventDay | null> => {
  return await getDay(dayNumber);
};

export const getAllDays = async (): Promise<AdventDay[]> => {
  return adventDaysData;
};

// No database initialization needed
export const initializeDatabase = async () => {
  console.log('📊 Using static data - no database needed');
};
