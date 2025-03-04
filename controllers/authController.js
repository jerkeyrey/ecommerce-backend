import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

// Register User
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};