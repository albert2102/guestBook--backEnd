var passport = require ( 'passport');
var passportJwt = require (  'passport-jwt');
var passportLocal = require (  'passport-local');
var config = require (  '../config');
var User = require (  '../component/user.component/user.model');
const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = passportLocal.Strategy;
const { ExtractJwt } = passportJwt;
const { jwtSecret } = config;


passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}, (payload, done) => {
    User.findOne({ _id: payload.sub, deleted: false, activated: true }).then(user => {
        if (!user)
            return done(null, false);

        return done(null, user)
    }).catch(err => {
        console.log('Passport Error: ', err);
        return done(null, false);
    })
}
));

passport.use(new LocalStrategy({
    usernameField: 'email'
}, (email, password, done) => {

    User.findOne({ email, deleted: false }).then(user => {
        if (!user)
            return done(null, false);

        // Compare Passwords 
        user.isValidPassword(password, function (err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { error: 'Invalid Credentials' });

            return done(null, user);
        })

    });
}));


const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });

module.exports = { requireAuth, requireSignIn};