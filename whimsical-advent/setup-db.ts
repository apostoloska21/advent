import { Pool } from 'pg';

// Database setup script for local development
async function setupDatabase() {
  const pool = new Pool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default database first
  });

  try {
    console.log('🔧 Setting up PostgreSQL database...');

    // Create database if it doesn't exist
    await pool.query(`
      CREATE DATABASE whimsical_advent
      WITH OWNER = postgres
      ENCODING = 'UTF8'
      LC_COLLATE = 'en_US.UTF-8'
      LC_CTYPE = 'en_US.UTF-8'
      TEMPLATE = template0;
    `).catch(err => {
      if (err.code === '42P04') {
        console.log('📊 Database already exists');
      } else {
        throw err;
      }
    });

    console.log('✅ Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
