import type { VercelRequest, VercelResponse } from '@vercel/node';
import adventDaysData from '../src/assets/data.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📊 Days API called');

    // Get day by number if specified
    const dayNumber = req.query.day ? parseInt(req.query.day as string) : null;

    if (dayNumber) {
      // Return specific day
      console.log(`🔍 Looking for day ${dayNumber}`);
      const dayData = adventDaysData.find(day => day.day === dayNumber);
      if (!dayData) {
        console.log(`❌ Day ${dayNumber} not found`);
        return res.status(404).json({ error: 'Day not found' });
      }
      console.log(`✅ Found day ${dayNumber}`);
      return res.status(200).json({ day: dayData });
    } else {
      // Return all days
      console.log(`📋 Returning all ${adventDaysData.length} days`);
      return res.status(200).json({ days: adventDaysData });
    }
  } catch (error) {
    console.error('❌ Error in days API:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
