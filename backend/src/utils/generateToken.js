import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const generateToken = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

export { generateToken, verifyToken };
export default generateToken;
