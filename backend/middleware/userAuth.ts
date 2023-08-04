import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserInput } from './adminAuth';
const USERSECRET = "users3cr3t";

export const userGenerateJwt = (user: UserInput) => {
    let admin = { username: user.username };
    return jwt.sign(admin, USERSECRET, { expiresIn: "1h" });
}

export const USERAUTHENTICATIONJWT = (req: Request, res: Response, next: NextFunction) => {
    let jwtToken = req.headers.authorization;
    if (!jwtToken) {
        return res.sendStatus(403);
    }
    let token = jwtToken.split(" ");
    if (token) {
        jwt.verify(token[1], USERSECRET, (err, original) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!original) {
                return res.sendStatus(403);
            }
            if (typeof original === "string") {
                return res.sendStatus(403);
            }
            req.headers["user"] = original?.username;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};