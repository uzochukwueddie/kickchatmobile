const express = require('express');
const router = express.Router();

const GroupCtrl = require('../controllers/groupchatCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/roomname/:name', AuthHelper.VerifyToken, GroupCtrl.getRoomMessages);

router.post('/save-group-chat', AuthHelper.VerifyToken, GroupCtrl.saveRoomMsg);

module.exports = router;