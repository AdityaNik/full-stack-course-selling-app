const jwt = require('jsonwebtoken');
const ADMINSECRET = "admins3cr3t";


const adminGenerateJwt = (user) => {
    let admin = { username: user.username };
    return jwt.sign(admin, ADMINSECRET, { expiresIn: "1h" });
}

const ADMINAUTHENTICATIONJWT = (req, res, next) => {
    let jwtToken = req.headers.authorization;
    let token = jwtToken.split(" ");
    if (token) {
        jwt.verify(token[1], ADMINSECRET, (err, original) => {
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
    adminGenerateJwt,
    ADMINAUTHENTICATIONJWT
}