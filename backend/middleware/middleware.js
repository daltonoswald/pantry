const jwt = require('jsonwebtoken');
const opts = { expiresIn: '7d' };
const secret = process.env.TOKEN_KEY || TOKEN_KEY;

const generateToken = (user) => jwt.sign({ id: user.id, username: user.username }, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

// function verifyToken(token) {
//     try {
//         const decoded = jwt.verify(token, secret)
//         console.log('decoded', decoded)
//         console.log('in the try mw')
//     } catch (err) {
//         console.log('in the catch mw')
//         console.log(err)
//         return err
//     }
// }

module.exports = { generateToken, verifyToken };