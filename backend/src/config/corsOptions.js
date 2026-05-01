import { env } from './env.js';

const corsOptions = {
  origin: ['https://dine-q-e3bx.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

export default corsOptions;
