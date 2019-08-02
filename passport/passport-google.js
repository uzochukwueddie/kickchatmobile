const passport = require('passport');
const User = require('../models/User');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const Helpers = require('../helpers/helpers');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
    
}, async (req, accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({google: profile.id});
    if (user) {
        return done(null, user);
    } else {
        const name = profile.displayName.split(' ');
        const email = profile.emails[0].value.split('@');
        let username;

        const checkUsername = await User.findOne({username: Helpers.firstUpper(name[0])});
        if (checkUsername) {
            username = Helpers.firstUpper(name[1]) || Helpers.firstUpper(email[0]);
        } else {
            username = Helpers.firstUpper(name[0]);
        }

        const newUser = new User();
        newUser.google = profile.id;
        newUser.username = username;
        newUser.email = profile.emails[0].value;
        newUser.googleToken = accessToken;
        
        newUser.save((err) => {
            if(err){
                return done(err)
            }
            return done(null, newUser);
        });
    }
}));