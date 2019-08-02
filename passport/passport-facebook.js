const passport = require('passport');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;

const Helpers = require('../helpers/helpers');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLEINT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: process.env.FB_CALLBACK,
    passReqToCallback: true
    
}, async (req, accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({facebook: profile.id});
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
        newUser.facebook = profile.id;
        newUser.username = username;
        newUser.email = profile.emails[0].value;
        newUser.fbToken = accessToken;
        
        newUser.save((err) => {
            if(err){
                return done(err)
            }
            return done(null, newUser);
        });
    }
}));