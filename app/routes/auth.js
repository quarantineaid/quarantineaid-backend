const express = require('express')
const router = express.Router()
const passport = require('passport')
const { generateToken, sendToken } = require('../../utils/passport')
const { facebookAuth, googleAuth } = require('../controllers/auth')
const trimRequest = require('trim-request')
require('../../config/passport')()

/*
 * Prelogin routes
 */
router.post(
  '/auth/facebook',
  trimRequest.all,
  passport.authenticate('facebook-token', { session: false }),
  facebookAuth,
  generateToken,
  sendToken
)

router.post(
  '/auth/google',
  trimRequest.all,
  passport.authenticate('google-id-token', { session: false }),
  googleAuth,
  generateToken,
  sendToken
)

module.exports = router
