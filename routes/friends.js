const express = require('express');
const router = express.Router();

const FriendCtrl = require('../controllers/friendCtrl');
const AuthHelper = require('../helpers/authHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtrl.unFollowUser);


module.exports = router;