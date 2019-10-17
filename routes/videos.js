const express = require("express");
const router = express.Router();

const VideosCtrl = require('../controllers/videosCtrl');
const AuthHelper = require('../helpers/authHelper');

router.get('/search-videos', AuthHelper.VerifyToken, VideosCtrl.getVideos);
router.post('/search-videosn', VideosCtrl.getVideosUrl);


module.exports = router;