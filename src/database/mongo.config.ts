import mongoose from 'mongoose';

export const mongoConfig = async (mongoUri?: string) => {
  try {
    await mongoose.connect(mongoUri || process.env.DATABASE_URL!);
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
  }
};
