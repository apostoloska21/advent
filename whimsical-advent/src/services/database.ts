// API-based database operations (client-side safe)

export interface AdventDay {
  id: number;
  day: number;
  message: string;
  clue: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Days operations
export const getDay = async (dayId: number): Promise<AdventDay | null> => {
  try {
    const response = await fetch(`/api/days?day=${dayId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.day || null;
  } catch (error) {
    console.error('Error fetching day:', error);
    return null;
  }
};

export const getDayByNumber = async (dayNumber: number): Promise<AdventDay | null> => {
  return await getDay(dayNumber);
};

export const getAllDays = async (): Promise<AdventDay[]> => {
  try {
    const response = await fetch('/api/days');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.days || [];
  } catch (error) {
    console.error('Error fetching all days:', error);
    return [];
  }
};

// Database initialization is now handled by API routes
export const initializeDatabase = async () => {
  console.log('🔍 Database initialization handled by API routes');
  // The API routes will handle seeding automatically
};
