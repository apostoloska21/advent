// JSON-based operations (direct import from data.json)

import adventDaysData from '@/assets/data.json';

export interface AdventDay {
  day: number;
  message: string;
  clue: string;
  }

// Days operations using JSON data
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

// No initialization needed
export const initializeDatabase = async () => {
  console.log('📄 Using JSON data - no API calls needed');
};
