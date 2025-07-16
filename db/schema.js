import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
});

// Creating users table
const createUsersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL
      );
    `);
    console.log("Users table created");
  } catch (err) {
    console.error("Failed to create users table:", err);
  } finally {
    client.release();
  }
};

// Creating events table
const createEventsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        date_time TIMESTAMP NOT NULL,
        location VARCHAR(100) NOT NULL,
        capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
      );
    `);
    console.log("Events table created");
  } catch (err) {
    console.error("Failed to create events table:", err);
  } finally {
    client.release();
  }
};

// Creating registrations table
const createRegistrationsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        user_id INT REFERENCES users(id),
        event_id INT REFERENCES events(id),
        PRIMARY KEY (user_id, event_id)
      );
    `);
    console.log("Registrations table created");
  } catch (err) {
    console.error("Failed to create registrations table:", err);
  } finally {
    client.release();
  }
};

// Finall schema
const createAllTables = async () => {
  await createUsersTable();
  await createEventsTable();
  await createRegistrationsTable();
  await pool.end();
};

// createAllTables();
