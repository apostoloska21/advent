import { createDay } from '../services/database';
import { adventDaysData } from '../data/seedData';

export const seedDatabase = async () => {
  console.log('🌟 Starting database seeding...');

  try {
    for (const dayData of adventDaysData) {
      console.log(`Creating day ${dayData.day}...`);
      await createDay({
        ...dayData,
        isActive: false // All days start locked
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('🎄 31 magical advent days have been created.');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// For running the script directly
if (import.meta.env.DEV) {
  // Only run in development
  seedDatabase().catch(console.error);
}
