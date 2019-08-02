const express = require('express');
const router = express.Router();

const RoomsCtrl = require('../controllers/roomsCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/rooms', AuthHelper.VerifyToken, RoomsCtrl.getAllRooms);
router.get('/room/:name', RoomsCtrl.getRoom);

router.post('/room/add-favorite', AuthHelper.VerifyToken, RoomsCtrl.addToFavorite);

module.exports = router;