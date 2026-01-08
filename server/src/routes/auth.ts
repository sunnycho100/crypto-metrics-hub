import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readUsers, writeUsers, findUserByEmail, findUserById } from '../services/userStore.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const DEV_LOGIN_ID = process.env.DEV_LOGIN_ID || '';
const DEV_LOGIN_PASSWORD = process.env.DEV_LOGIN_PASSWORD || '';

const DEV_USER = {
  id: 'developer-mode',
  email: 'developer@local',
  name: 'Developer Mode',
  createdAt: new Date(0).toISOString(),
  isDeveloper: true,
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    // Save user
    const users = await readUsers();
    users.push(newUser);
    await writeUsers(users);

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user (includes developer mode shortcut)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Developer mode bypass using env-configured credentials
    if (DEV_LOGIN_ID && DEV_LOGIN_PASSWORD && email === DEV_LOGIN_ID && password === DEV_LOGIN_PASSWORD) {
      const token = jwt.sign({ userId: DEV_USER.id, isDeveloper: true, mode: 'developer' }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.json({
        message: 'Developer login successful',
        user: DEV_USER,
        token,
      });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; isDeveloper?: boolean; mode?: string };

    if (decoded.isDeveloper || decoded.mode === 'developer') {
      return res.json({ user: DEV_USER });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can add server-side blacklist later)
router.post('/logout', (req, res) => {
  // TODO: Add token to blacklist when Redis is implemented
  res.json({ message: 'Logged out successfully' });
});

export default router;
