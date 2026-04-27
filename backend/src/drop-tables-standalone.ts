import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function dropTables() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: false, // CRITICAL: Disable sync here
  });

  await dataSource.initialize();
  console.log('Connected to database.');

  console.log('Dropping tables...');
  try {
    await dataSource.query('DROP TABLE IF EXISTS "vocabulary" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "lessons" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "courses" CASCADE');
    console.log('Tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await dataSource.destroy();
  }
}

dropTables();
