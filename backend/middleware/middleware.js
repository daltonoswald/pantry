const jwt = require('jsonwebtoken');
const opts = { expiresIn: '7d' };
const secret = process.env.TOKEN_KEY || TOKEN_KEY;

const generateToken = (user) => jwt.sign({ id: user.id, username: user.username }, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            const authorizedUser = verifyToken(token);
            req.user = authorizedUser.user; // Attach user to request
        } catch (error) {
            // Invalid token, continue without user
            req.user == null
        }
    } else {
        req.user = null;
    }

    next();
}

module.exports = { generateToken, verifyToken, optionalAuth };