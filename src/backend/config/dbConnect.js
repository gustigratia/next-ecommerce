/**
 * dbConnect function manages the connection to the MongoDB database using Mongoose.
 * It checks if a connection is already established; if not, it sets certain options and establishes a new connection.
 * @returns {void}
 */
import mongoose from 'mongoose';

const dbConnect = () => {
  // Check if a connection is already established
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  // Set Mongoose option to allow using fields not defined in the schema
  mongoose.set('strictQuery', false);
  // Establish a new connection to the MongoDB database using the provided URI
  mongoose.connect(process.env.DB_URI);
};

export default dbConnect;
