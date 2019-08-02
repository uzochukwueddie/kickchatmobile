const express = require("express");
const router = express.Router();

const ResetCtrl = require('../controllers/resetCtrl');

router.post('/get-code', ResetCtrl.getCode);
router.post('/reset-password/:token', ResetCtrl.resetPassword);


module.exports = router;