const User = require('../models/user')
const utils = require('../middleware/utils')
const { matchedData } = require('express-validator')

// eslint-disable-next-line consistent-return
exports.facebookAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated')
    }
    req.auth = {
      id: req.user.id
    }
    // eslint-disable-next-line callback-return
    next()
  } catch (error) {
    utils.handleError(res, error)
  }
}

// eslint-disable-next-line consistent-return
exports.googleAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated')
    }
    req.auth = {
      id: req.user.id
    }
    // eslint-disable-next-line callback-return
    next()
  } catch (error) {
    utils.handleError(res, error)
  }
}
