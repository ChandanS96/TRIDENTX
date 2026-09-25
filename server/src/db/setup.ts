import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes('user:password@localhost')) {
    console.error('❌ Error: Please update your DATABASE_URL in server/.env with your real Supabase connection string before running this script.');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase connections outside their network
  });

  try {
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 Running schema.sql...');
    await pool.query(schemaSql);
    
    console.log('✅ Database setup complete! All tables have been created successfully.');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end();
  }
};

setupDatabase();
