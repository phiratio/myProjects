const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('./../models/User');
const Cat = require('./../models/Cat');

const authenticateUser = (username, password, done) => {
    User.findOne({email: username}).then(user => {
       if(!user) {
           return done(null, false);
       }

       if(!user.authenticate(passport)) {
           return done(null, false);
       }

       return done(null, user);
    });
};

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalPassport({
        usernameField: 'email',
        passwordField: 'password'
    }, authenticateUser));

    passport.serializeUser((user, done) => {
        if(!user) {
            return done(null, false);
        }

        return done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if(!user) {
                return done(null, false);
            }

            return done(null, user);
        })
    });

    // require('./strategies/google.strategy')();

};