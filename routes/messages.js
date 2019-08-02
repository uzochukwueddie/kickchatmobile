const express = require('express');

const router = express.Router();

const MessageCtrl = require('../controllers/messageCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/chat-messages/:receiverId', AuthHelper.VerifyToken, MessageCtrl.getAllMessages);
router.get('/receiver-messages/:senderId/:receiverId', AuthHelper.VerifyToken, MessageCtrl.markReceiverMessages);
router.get('/mark-all-messages', AuthHelper.VerifyToken, MessageCtrl.markAllMessages);

router.post('/chat-messages/:receiverId', AuthHelper.VerifyToken, MessageCtrl.sendMessage);

module.exports = router;
