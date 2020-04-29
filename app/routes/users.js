const controller = require('../controllers/users')
const validate = require('../controllers/users.validate')
const { createToken } = require('../../utils/passport')
const authCheck = require('../middleware/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

/*
 * Users routes
 */

// eslint-disable-next-line no-unused-vars
router.put(
  '/profile',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.updateProfile
)

router.get(
  '/verify/:number',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.verifyPhone
)

router.post(
  '/verify-otp',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.verifyOtp
)

module.exports = router
