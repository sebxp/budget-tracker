import { Db, MongoClient } from 'mongodb';
let cachedDb: Db;
let client: MongoClient;

export async function connectToDatabase() {
    if (cachedDb) {
        console.log("Existing cached connection found!");
        return cachedDb;
    }
    console.log("Aquiring new DB connection....");
    try {
        client = await MongoClient.connect(process.env.MONGO_URI!);
        const db = client.db('budget');
        cachedDb = db;
        return db;
    } catch (error) {
        console.log("ERROR aquiring DB Connection!");
        console.log(error);
        throw error;
    }

}