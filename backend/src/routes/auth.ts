import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { Progress } from '../models/Progress';
import { auth, getUserId } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'abtalks-jwt-secret-2024';

// Zod schemas
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Helper to generate JWT
function generateToken(userId: string, email: string, username: string): string {
  return jwt.sign({ userId, email, username }, JWT_SECRET, { expiresIn: '30d' });
}

// POST /register
router.post('/register', validate(registerSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      }
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Create progress record for the user
    await Progress.create({
      userId: user._id,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      longestStreak: 0,
      xp: 0,
      rank: 0,
      selectedTrack: 'general',
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      lastActivityAt: new Date(),
    });

    // Generate JWT token
    const token = generateToken(
      (user._id as any).toString(),
      user.email!,
      user.username
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /login
router.post('/login', validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find user by email OR username, and select password field explicitly
    const isEmail = emailOrUsername.includes('@');
    const user = await User.findOne(
      isEmail ? { email: emailOrUsername } : { username: emailOrUsername }
    ).select('+password');

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(
      (user._id as any).toString(),
      user.email!,
      user.username
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /me - Protected route
router.get('/me', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get user progress
    const progress = await Progress.findOne({ userId });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        college: user.college,
        graduationYear: user.graduationYear,
        createdAt: user.createdAt,
      },
      progress: progress || null,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

export default router;
