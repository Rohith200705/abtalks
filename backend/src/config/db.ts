import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env';

// Use Google DNS to resolve MongoDB Atlas SRV records
// (local DNS may not support SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    console.log('Server will continue without database. Using demo/mock data.');
  }
};
