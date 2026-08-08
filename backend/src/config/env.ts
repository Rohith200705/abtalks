import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JUDGE0_URL: process.env.JUDGE0_URL || '',
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || 'demo',
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || 'http://localhost:5000/api/github/callback',
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || '',
  LINKEDIN_REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:5000/api/linkedin/callback',
  LINKEDIN_MODE: process.env.LINKEDIN_MODE || 'demo',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'defaultencryptionkey123456789012',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
};
