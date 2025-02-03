import { NextApiResponse } from 'next';
import { authenticateJWT, NextApiRequestWithUser } from '../../../utils/auth';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        return authenticateJWT(req, res, async () => {
            const budgets = await db.collection('budgets').find({ userId: req.user.id }).toArray();
            return res.status(200).json(budgets);
        });
    }

    if (req.method === 'POST') {
        return authenticateJWT(req, res, async () => {
            const budget = req.body;
            const result = await db.collection('budgets').insertOne({ userId: req.user.id, ...budget });
            return res.status(201).json({ _id: result.insertedId });
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}