import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateJWT, NextApiRequestWithUser } from '../../../utils/auth';
import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();

    if (req.method === 'PUT') {
        return authenticateJWT(req as NextApiRequestWithUser, res, async () => {
            const id = req.query.budgetId;
            const budget = req.body;
            await db.collection('budgets').updateOne({ _id: new ObjectId(id.toString()) }, { $set: { ...budget } });
            return res.status(201).json({ _id: id, ...budget });
        });
    }

    if (req.method === 'DELETE') {
        return authenticateJWT(req as NextApiRequestWithUser, res, async () => {
            const id = req.query.budgetId;
            await db.collection('budgets').deleteOne({ _id: new ObjectId(id.toString()) });
            return res.status(201).json({ _id: id });
        });
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}