const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

module.exports = {
  VerifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'No Authorization' });
    }
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.data;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
  }
};