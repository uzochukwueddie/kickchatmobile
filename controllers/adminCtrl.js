const Club = require('../models/Club');
const Country = require('../models/Countries');
const express = require("express");
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

router.post('/dashboard', (req, res) => {
    const newClub = new Club();
    newClub.name = req.body.club;
    newClub.country = req.body.country;
    newClub.image = req.body.upload;
    newClub.save((err) => {
        res.render('dashboard');
    });
});

router.get('/dashboard/add-country', (req, res) => {
    res.render('add-country');
});

router.post('/dashboard/add-country', (req, res) => {
    const country = new Country();
    country.name = req.body.country;
    country.image = req.body.image;
    country.save((err) => {
        res.render('add-country');
    });
});

module.exports = router;