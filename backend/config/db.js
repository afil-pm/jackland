import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/jackland';
    
    // Check if Mongo URI is default/localhost
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI not found in environment variables. Using localhost default.');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Timeout fast (5 seconds) to avoid freezing startup
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Express server is starting anyway. Database actions will fail until MONGO_URI is configured correctly in backend/.env.');
  }
};

export { isConnected };
export default connectDB;
