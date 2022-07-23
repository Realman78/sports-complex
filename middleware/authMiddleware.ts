import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { decodedUser } from '../types/express/custom';

export const protect = async (req: Request<{},{},{token: string},{token: string}>, res: Response, next: NextFunction) => {
    let token: string | undefined = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ message: "A token is required for authentication." });
    }

    try {
        token = token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
        req.user = decoded as decodedUser
        if (req.user.status !== "Active") {
            return res.status(401).send({ message: "Pending Account. Please Verify Your Email." })
        }
    } catch (err) {
        return res.status(401).send({ message: "Invalid Token." });
    }

    return next();
}

export const manageAccess = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') return next()

    return res.status(403).send({ message: "User has no admin rights." });
}

