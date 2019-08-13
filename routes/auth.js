const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/authCtrl');

router.post('/register', AuthCtrl.createUser);
router.post('/login', AuthCtrl.loginUser);
router.post('/login-facebook', AuthCtrl.loginWithFacebook);
router.post('/login-google', AuthCtrl.loginWithGoogle);

module.exports = router;