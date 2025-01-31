import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, NextApiRequestWithUser } from '../../../utils/auth';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();

    if (req.method === 'GET') {
        const budgets = await db.collection('budgets').find({}).toArray();
        return res.status(200).json(budgets);
    }

    if (req.method === 'POST') {
        return authenticateJWT(req as NextApiRequestWithUser, res, async () => {
            const budget = req.body;
            const result = await db.collection('budgets').insertOne(budget);
            return res.status(201).json({ _id: result.insertedId, ...budget });
        });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}