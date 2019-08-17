const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Verifier = require("email-verifier");

let verifier = new Verifier(process.env.EMAIL_VERIFY_API);

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
  },

  verifyEmail: (req, res, next) => {
    verifier.verify(req.body.email, (err, data) => {
      try {
        if (data.smtpCheck === false || data.disposableCheck === true) {
          return res.status(HttpStatus.BAD_REQUEST).json({ message: `${req.body.email} is invalid. Please provide a valid email to continue.`, msgData: data });
        } else {
          next();
        }
      } catch (err) {
        res.status(401).json({ message: 'Error occurred while signing up. Please try again.' });
      }
    });
  }
};