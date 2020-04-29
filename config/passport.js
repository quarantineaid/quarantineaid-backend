const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')
const GoogleTokenStrategy = require('passport-google-id-token')
const User = require('../app/models/user')

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        profileFields: ['id', 'name', 'picture', 'emails', 'gender']
      },
      (accessToken, refreshToken, profile, done) => {
        User.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
          return done(err, user)
        })
      }
    )
  )
  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID
        // clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      (parsedToken, googleId, done) => {
        User.upsertGoogleUser(parsedToken, googleId, (err, user) => {
          return done(err, user)
        })
      }
    )
  )
}
