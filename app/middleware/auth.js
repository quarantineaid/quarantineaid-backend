/* eslint-disable callback-return */
const raven = require('raven')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const { get, has, toLower } = require('lodash/fp')
const jwtDecode = require('jwt-decode')
const User = require('../models/user')
const utils = require('../middleware/utils')
const secret = process.env.JWT_SECRET

const validateJwt = (req, res, next) => {
  expressJwt({ secret })(req, res, (err) => {
    if (err) {
      if (err.message === 'jwt expired') {
        next(err)
      } else {
        expressJwt({ secret })(req, res, next)
      }
    } else {
      next()
    }
  })
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403, unless optional is true
 */
const isAuthenticated = function (optional, skipDb) {
  return (
    compose()
      // Validate jwt
      .use(function coreAuthentification(req, res, next) {
        // allow jwt token to be passed through 'x-parse-session-token' header
        if (req.headers['x-parse-session-token']) {
          req.headers.authorization = `Bearer ${req.headers['x-parse-session-token']}`
        }
        // allow jwt token to be passed through 'access-token' header
        if (req.headers['access-token']) {
          req.headers.authorization = `Bearer ${req.headers['access-token']}`
        }
        // allow access_token to be passed through query parameter as well
        if (req.query && has(req.query, 'access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`
        }
        if (optional && !req.headers.authorization) {
          next()
        } else {
          validateJwt(req, res, next)
        }
      })
      // Attach user to request
      // eslint-disable-next-line max-statements
      .use(async function attachUserToRequest(req, _res, next) {
        req.user = req.user || {}
        const token = req.headers['access-token']
        const { id: userId } = jwtDecode(token, { secret })
        raven.setContext({})
        try {
          raven.mergeContext({
            user: { id: userId },
            tags: {
              component: 'api',
              platform: toLower(get(req, 'headers.platform')),
              version: get(req, 'headers.version')
            },
            extra: {
              location: req.location
            }
          })

          if ((optional && !req.headers.authorization) || skipDb) {
            return next()
          }
          const user = await User.findOne({ _id: userId })
          if (user) {
            req.user = user
            raven.mergeContext({ user: { id: userId } })
            return next()
          }
          return next(utils.buildErrObject(401, 'Unauthorised'))
        } catch (err) {
          return next(err)
        }
      })
  )
}

module.exports = {
  isAuthenticated
}
