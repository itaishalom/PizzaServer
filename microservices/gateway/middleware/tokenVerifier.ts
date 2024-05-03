import {VerifyErrors, verify } from 'jsonwebtoken';

import {Response, NextFunction} from 'express';

import { JWT_SECRET } from '../config';
import {RequestWithUser} from "./requestForwarder";

class TokenVerifier {
    verify() {
        return (req: RequestWithUser, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            verify(token, JWT_SECRET, (err: VerifyErrors | null, decoded: any) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({ message: 'Token expired' });
                    }
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = decoded;
                next();
            });
        };
    }
}

export default TokenVerifier;
