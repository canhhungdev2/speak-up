import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function dropTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Dropping tables to reset schema...');
  try {
    await dataSource.query('DROP TABLE IF EXISTS "vocabulary" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "lessons" CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS "courses" CASCADE');
    // Note: We don't drop "profiles" as it contains user data from Supabase
    console.log('Tables dropped successfully!');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await app.close();
  }
}

dropTables();
