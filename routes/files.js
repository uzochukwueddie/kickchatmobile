'use strict';

const express = require('express');
const router = express.Router();

const FileCtrl = require('../controllers/fileCtrl');
const AuthHelper = require('../helpers/authHelper');


router.post('/room/upload', AuthHelper.VerifyToken, FileCtrl.roomChatFile);
router.post('/chat-image/:receiverId',
    AuthHelper.VerifyToken,
    FileCtrl.privateChatFile
);
router.post('/profile/image', AuthHelper.VerifyToken, FileCtrl.addProfileImage);




module.exports = router;