const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');


router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', (req,res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }), (req,res) => {

    req.flash('success','welcome back');
    const redirectUrl = req.session.returnTo || '/places';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success','Goodbye!');
    res.redirect('/places');
})
module.exports = router;