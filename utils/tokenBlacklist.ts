// utils/tokenBlacklist.ts

import { connectToDatabase } from "./mongodb";

export async function addToBlacklist(token: string, expiresIn: number) {
    const db = await connectToDatabase();
    const blacklistCollection = db.collection('tokenBlacklist');

    // Calculate the expiration date based on the token's expiration time
    const expiryDate = new Date(Date.now() + expiresIn * 1000); // expiresIn is in seconds

    await blacklistCollection.insertOne({ token, expiryDate });
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
    const db = await connectToDatabase();
    const blacklistCollection = db.collection('tokenBlacklist');

    // Find if the token is already blacklisted
    const found = await blacklistCollection.findOne({ token });
    if (found) {
        // Check if the token is still valid
        const now = new Date();
        if (now < found.expiryDate) {
            return true;
        } else {
            // Clean up expired token
            await blacklistCollection.deleteOne({ token });
        }
    }
    return false;
}