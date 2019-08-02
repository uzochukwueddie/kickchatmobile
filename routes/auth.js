const express = require('express');
const passport = require('passport');
const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');

const router = express.Router();

const AuthCtrl = require('../controllers/authCtrl');

const redirect = 'http://localhost:8100/intro';
const successUrl = 'http://localhost:8100/kickchat/streams';

router.post('/register', AuthCtrl.createUser);
router.post('/login', AuthCtrl.loginUser);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", 
    { 
        failureRedirect: redirect, 
        session: false 
    }), (req, res) => {
        const user = req.user;
        const userData = {
            _id: user._id,
            username: user.username
        }
        const token = jwt.sign({ data: userData }, 'secrethere', {});
        res.redirect(`${successUrl}?googleToken=${token}`);
});

router.get("/auth/facebook", passport.authenticate("facebook", { scope: 'email' }));
router.get("/auth/facebook/callback", passport.authenticate("facebook", 
    { 
        failureRedirect: redirect, 
        session: false 
    }), (req, res) => {
        const user = req.user;
        const userData = {
            _id: user._id,
            username: user.username
        }
        const token = jwt.sign({ data: userData }, 'secrethere', {});
        res.redirect(`${successUrl}?fbToken=${token}`);
});

module.exports = router;