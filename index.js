const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const axios = require('axios');
const passport = require('passport');
const cookieSession = require('cookie-session');
const SpotifyStrategy = require('passport-spotify').Strategy;
const PORT = 3000;

require('./database');

app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'spotify-auth-session',  
    keys: ['key1', 'key2']
  }));
  
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  passport.use(new SpotifyStrategy({
    clientID: "9918187d11754ca3ac4d44222cc47908",
    clientSecret: "7375f27e474c4234af1571058d7c48c8",
    callbackURL: "http://localhost:3000/top-tracks"
  },
  function (accessToken, refreshToken, expires_in, profile, done) {
    try {
      const userResponse = {
        ...profile._json,
        accessToken,
        refreshToken,
        expires_in
      };
      done(null, userResponse);
    } catch (err) {
      done(err, null, { message: 'An error occurred trying to authenticate the user' });
    }
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-top-read'] }));
  
  app.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/top-tracks');
  });
  
  const songsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artists: [{ type: String }]
  });
  
  const Song = mongoose.model('Song', songsSchema);
  
  app.get('/top-tracks', async (req, res) => {
    try {
      const token = req.user.accessToken;
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const tracks = response.data.items.map(({ name, artists }) => ({
        name,
        artists: artists.map(artist => artist.name).join(', '),
      }));
  
      await Song.deleteMany(); // Remove existing tracks from the database
      const result = await Song.insertMany(tracks);
  
      res.json({ tracks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });