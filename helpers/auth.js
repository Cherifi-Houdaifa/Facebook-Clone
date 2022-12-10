const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../models/user");

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                const user = await User.findOne({ googleid: profile.id });
                if (!user) {
                    const newUser = await User.create({
                        username: profile.displayName,
                        googleid: profile.id,
                        profilePic: profile.picture,
                    });
                    return done(null, newUser);
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
            session: false,
        },
        async function (username, password, done) {
            try {
                const user = await User.findOne({ username: username });
                if (!user) {
                    return done(null, false);
                }
                const result = await bcrypt.compare(password, user.password);
                if (result) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        async function (payload, done) {
            try {
                const user = await User.findById(payload._id);
                if (!user) {
                    return done(null, false);
                }
                return done(null, payload);
            } catch (err) {
                done(err);
            }
        }
    )
);
