const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/authCtrl');
const AuthHelper = require('../helpers/authHelper');

router.post('/register', AuthHelper.verifyEmail, AuthCtrl.createUser);
router.post('/login', AuthCtrl.loginUser);
router.post('/login-facebook', AuthCtrl.loginWithFacebook);
router.post('/login-google', AuthCtrl.loginWithGoogle);

module.exports = router;