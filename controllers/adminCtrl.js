const Club = require('../models/Club');
const Epl = require('../models/EPL');
const Ligue = require('../models/Ligue1');
const Bundesliga = require('../models/Bundesliga');
const Laliga = require('../models/Laliga');
const Seria = require('../models/SeriaA');
const Country = require('../models/Countries');
const express = require("express");
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// router.post('/dashboard', (req, res) => {
//     const newClub = new Club();
//     newClub.name = req.body.club;
//     newClub.country = req.body.country;
//     newClub.image = req.body.upload;
//     newClub.save((err) => {
//         res.render('dashboard');
//     });
// });

router.post('/dashboard', (req, res) => {
    if (req.body.country === 'England') {
        const newClub = new Epl();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Spain') {
        const newClub = new Laliga();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'France') {
        const newClub = new Ligue();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Germany') {
        const newClub = new Bundesliga();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
    if (req.body.country === 'Italy') {
        const newClub = new Seria();
        newClub.name = req.body.club;
        newClub.country = req.body.country;
        newClub.image = req.body.upload;
        newClub.save((err) => {
            res.render('dashboard');
        });
    }
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