const jwt = require('jsonwebtoken');
const opts = { expiresIn: '7d' };
const secret = process.env.TOKEN_KEY || TOKEN_KEY;
const generateToken = (user) => jwt.sign({ id: user.id, username: user.username }, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

module.exports = { generateToken, verifyToken };