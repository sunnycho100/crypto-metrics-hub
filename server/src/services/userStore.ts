import { userQueries } from './database.js';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

// Create a new user
export function createUser(user: Omit<User, 'updated_at' | 'last_login'>): User {
  userQueries.create.run(user.id, user.email, user.password, user.name, user.created_at);
  return user;
}

// Find user by email
export function findUserByEmail(email: string): User | undefined {
  return userQueries.findByEmail.get(email) as User | undefined;
}

// Find user by ID
export function findUserById(id: string): User | undefined {
  return userQueries.findById.get(id) as User | undefined;
}

// Update last login timestamp
export function updateLastLogin(userId: string, timestamp: string): void {
  userQueries.updateLastLogin.run(timestamp, userId);
}

// Get all users (without passwords)
export function getAllUsers(): Omit<User, 'password'>[] {
  return userQueries.getAll.all() as Omit<User, 'password'>[];
}

// Delete user
export function deleteUser(userId: string): void {
  userQueries.delete.run(userId);
}

// Legacy compatibility functions (async wrappers)
export async function readUsers(): Promise<User[]> {
  return userQueries.getAll.all() as User[];
}

export async function writeUsers(users: User[]): Promise<void> {
  // This function is no longer needed with SQLite
  // Kept for backward compatibility but does nothing
  console.warn('writeUsers is deprecated - database writes happen automatically');
}
