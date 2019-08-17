'use strict';

const express = require("express");
const router = express.Router();

const ProfileCtrl = require('../controllers/profileCtrl');
const AuthHelper = require('../helpers/authHelper');

router.post('/user/profile', AuthHelper.VerifyToken, ProfileCtrl.addProfile);
router.post('/user/interests', AuthHelper.VerifyToken, ProfileCtrl.addInterest);
router.post('/interest/delete', AuthHelper.VerifyToken, ProfileCtrl.deleteInterest);
router.post('/interest/delete-fav-club', AuthHelper.VerifyToken, ProfileCtrl.deleteFavClub);

module.exports = router;

