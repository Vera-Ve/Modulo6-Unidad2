const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new SpotifyStrategy({
  clientID: "9918187d11754ca3ac4d44222cc47908",
  clientSecret: "7375f27e474c4234af1571058d7c48c8",
  callbackURL: "http://localhost:3000/top-tracks"
},
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}
));