import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Sign JWT
export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Verify JWT
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);