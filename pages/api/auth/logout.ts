// pages/api/auth/logout.ts

import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { addToBlacklist } from '../../../utils/tokenBlacklist';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            const expiresIn = Math.floor((decoded as jwt.JwtPayload).exp! * 1000 - Date.now());

            // Add the token to the blacklist with its expiration time
            addToBlacklist(token, expiresIn);

            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(403).json({ message: 'Invalid token' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}