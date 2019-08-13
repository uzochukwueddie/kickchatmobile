'use strict';

const express = require("express");
const router = express.Router();

const ClubCtrl = require('../controllers/clubCtrl');
const ClubMessageCtrl = require('../controllers/clubsMessageCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/club/England', AuthHelper.VerifyToken, ClubCtrl.getEnglishClubs);
router.get('/club/Spain', AuthHelper.VerifyToken, ClubCtrl.getSpanishClubs);
router.get('/club/Italy', AuthHelper.VerifyToken, ClubCtrl.getItalianClubs);
router.get('/club/Germany', AuthHelper.VerifyToken, ClubCtrl.getGermanClubs);
router.get('/club/France', AuthHelper.VerifyToken, ClubCtrl.getFrenchClubs);

router.get('/club-messages/:country/:club', AuthHelper.VerifyToken, ClubMessageCtrl.getClubMessages);
// router.get('/club-messages/Spain', AuthHelper.VerifyToken, ClubCtrl.getSpanishClubs);
// router.get('/club-messages/Italy', AuthHelper.VerifyToken, ClubCtrl.getItalianClubs);
// router.get('/club-messages/Germany', AuthHelper.VerifyToken, ClubCtrl.getGermanClubs);
// router.get('/club-messages/France', AuthHelper.VerifyToken, ClubCtrl.getFrenchClubs);

router.post('/club/:country', AuthHelper.VerifyToken, ClubCtrl.saveRoomMsg);
router.post('/clubs/add-favorite', AuthHelper.VerifyToken, ClubCtrl.addToFavorites);
// router.post('/club/Spain', AuthHelper.VerifyToken, ClubCtrl.saveLaligaMsg);
// router.post('/club/Italy', AuthHelper.VerifyToken, ClubCtrl.saveSeriaAMsg);
// router.post('/club/Germany', AuthHelper.VerifyToken, ClubCtrl.saveGermanMsg);
// router.post('/club/France', AuthHelper.VerifyToken, ClubCtrl.saveLigueOneMsg);

module.exports = router;

