const jwt = require('jsonwebtoken');
const USERSECRET = "users3cr3t";

const userGenerateJwt = (user) => {
    let admin = { username: user.username };
    return jwt.sign(admin, USERSECRET, { expiresIn: "1h" });
}

const USERAUTHENTICATIONJWT = (req, res, next) => {
    let jwtToken = req.headers.authorization;
    let token = jwtToken.split(" ");
    if (token) {
        jwt.verify(token[1], USERSECRET, (err, original) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = original;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

module.exports = {
    userGenerateJwt,
    USERAUTHENTICATIONJWT
}