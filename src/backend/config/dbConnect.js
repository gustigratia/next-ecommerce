import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const dbUri = process.env.DB_URI;

  if (!dbUri) {
    throw new Error('DB_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', false);

  await mongoose.connect(dbUri);
};

export default dbConnect;
