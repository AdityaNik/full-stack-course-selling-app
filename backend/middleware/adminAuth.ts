import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const ADMINSECRET = "admins3cr3t";

export interface UserInput {
    username: string,
    password: string
}

export const adminGenerateJwt = (user: UserInput) => {
    let admin = { username: user.username };
    return jwt.sign(admin, ADMINSECRET, { expiresIn: "1h" });
}

export const ADMINAUTHENTICATIONJWT = (req: Request, res: Response, next: NextFunction) => {
    let jwtToken = req.headers.authorization;
    if (!jwtToken) {
        return res.sendStatus(403);
    }
    let token = jwtToken.split(" ");
    if (token) {
        jwt.verify(token[1], ADMINSECRET, (err, original) => {
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