import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!);

export async function connectToDatabase() {
  await client.connect();
  const db = client.db('budget');
  return { db, client };
}