"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERAUTHENTICATIONJWT = exports.userGenerateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const USERSECRET = "users3cr3t";
const userGenerateJwt = (user) => {
    let admin = { username: user.username };
    return jsonwebtoken_1.default.sign(admin, USERSECRET, { expiresIn: "1h" });
};
exports.userGenerateJwt = userGenerateJwt;
const USERAUTHENTICATIONJWT = (req, res, next) => {
    let jwtToken = req.headers.authorization;
    if (!jwtToken) {
        return res.sendStatus(403);
    }
    let token = jwtToken.split(" ");
    if (token) {
        jsonwebtoken_1.default.verify(token[1], USERSECRET, (err, original) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!original) {
                return res.sendStatus(403);
            }
            if (typeof original === "string") {
                return res.sendStatus(403);
            }
            req.headers["user"] = original === null || original === void 0 ? void 0 : original.username;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.USERAUTHENTICATIONJWT = USERAUTHENTICATIONJWT;
