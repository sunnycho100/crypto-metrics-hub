import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store users in a JSON file (temporary solution)
// TODO: Replace with proper database (PostgreSQL, MongoDB, etc.)
const USERS_FILE = path.join(__dirname, '../../data/users.json');

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

// Ensure data directory and file exist
async function ensureDataFile(): Promise<void> {
  const dataDir = path.dirname(USERS_FILE);
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf-8');
  }
}

// Read all users from file
export async function readUsers(): Promise<User[]> {
  await ensureDataFile();
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write users to file
export async function writeUsers(users: User[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

// Find user by ID
export async function findUserById(id: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find((user) => user.id === id);
}
