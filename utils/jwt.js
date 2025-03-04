import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

// Sign JWT
export const generateToken = (user) => {
  try {
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log("✅ Generated Token:", token);
    return token;
  } catch (error) {
    console.error("❌ Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};

// Verify JWT
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Verified Token Payload:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    throw new Error("Invalid or expired token");
  }
};