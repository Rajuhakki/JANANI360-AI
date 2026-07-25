import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/janani360';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log(`[Database] Real MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] Real MongoDB daemon not active (${error.message}). Enabling High-Speed Memory Storage Engine...`);
    // Connect to in-memory pseudo-connection to prevent Mongoose buffering timeouts
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      console.log(`[Database] In-Memory MongoDB Engine Connected Successfully.`);
      return true;
    } catch (memError) {
      console.warn('[Database] In-memory server spinup skipped, using fallback mock memory layer.');
      return false;
    }
  }
};
