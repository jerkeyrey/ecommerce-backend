import bcrypt from 'bcryptjs';

// Hash the password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare passwords
export const comparePassword = async (input, hashed) => {
  return bcrypt.compare(input, hashed);
};