import mongoose from 'mongoose';

export const mongoConfig = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
  }
};
