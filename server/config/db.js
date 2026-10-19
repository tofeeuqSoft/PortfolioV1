import dns from 'node:dns';
import mongoose from 'mongoose';

// Some networks/VPNs block DNS SRV lookups (querySrv ECONNREFUSED).
// Set DNS_SERVERS="8.8.8.8,8.8.4.4" in .env to route lookups via a public
// resolver. Left unset, the system resolver is used unchanged.
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env.');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
}
