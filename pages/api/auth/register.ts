// pages/api/auth/register.ts

import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const db = await connectToDatabase();
            const usersCollection = db.collection('users');

            // Check if the user already exists
            const existingUser = await usersCollection.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            await usersCollection.insertOne({ username, password: hashedPassword });

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}