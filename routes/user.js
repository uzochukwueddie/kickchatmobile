const express = require('express');

const router = express.Router();

const UserCtrl = require('../controllers/userCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.VerifyToken, UserCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.VerifyToken, UserCtrl.getUserById);
router.get('/users/country/:country', AuthHelper.VerifyToken, UserCtrl.getUsersByCountry);
router.get(
    '/set-default-image/:imgId/:imgVersion',
    AuthHelper.VerifyToken,
    UserCtrl.setDefaultImage
);
router.get(
    '/delete-image/:imgId/:imgVersion',
    AuthHelper.VerifyToken,
    UserCtrl.deleteImage
);
router.get('/username/:username', AuthHelper.VerifyToken, UserCtrl.getUserUsername);
router.post('/block-user', AuthHelper.VerifyToken, UserCtrl.blockUser);
router.post('/unblock-user', AuthHelper.VerifyToken, UserCtrl.unblockUser);
router.post('/change-password', AuthHelper.VerifyToken, UserCtrl.changePassword);
router.post('/user/view-profile', AuthHelper.VerifyToken, UserCtrl.profileViewCount);
router.post('/mark-all', AuthHelper.VerifyToken, UserCtrl.markAllNotifications);
router.post('/mark/:id', AuthHelper.VerifyToken, UserCtrl.markNotification);
router.post('/add-city-country', AuthHelper.VerifyToken, UserCtrl.addUserLocation);

module.exports = router;