import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/NexTraction';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// Define the type for the cached mongoose instance
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the NodeJS.Global interface to include mongoose
declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection immediately if available
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is being established, wait for it
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // Create new connection with optimized settings for TTFB
  const opts = {
    bufferCommands: false,
    // Critical: Set connection timeout to reduce TTFB
    serverSelectionTimeoutMS: 5000, // 5 seconds max
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    // Connection pooling for better performance
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    // Reduce monitoring for faster connections
    heartbeatFrequencyMS: 30000,
    // Compression for faster data transfer
    compressors: ['zlib' as const],
  };

  try {
    cached.promise = mongoose.connect(MONGODB_URI, opts);
    cached.conn = await cached.promise;

    // Set up connection event handlers for monitoring
    cached.conn.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      // Reset cache on error to allow reconnection
      cached.conn = null;
      cached.promise = null;
    });

    cached.conn.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Reset cache on disconnect
      cached.conn = null;
      cached.promise = null;
    });

    return cached.conn;
  } catch (error) {
    // Reset cache on connection failure
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect;
