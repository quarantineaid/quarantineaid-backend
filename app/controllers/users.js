const model = require('../models/user')
const uuid = require('uuid')
const { phoneValidate, genOtp, sendSms } = require('../middleware/sms')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const emailer = require('../middleware/emailer')

/*********************
 * Private functions *
 *********************/

/********************
 * Public functions *
 ********************/

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateProfile = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.user.id)
    res.status(200).json(await db.updateItem(id, model, req.body))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verifyPhone = async (req, res) => {
  try {
    // check if number is a valid mobile number
    if (phoneValidate(req.params.number)) {
      const otpGen = Math.floor(1000 + Math.random() * 9000)
      let otpResp = {}
      // Increment OTP attemp on each request
      const userCheck = await model
        .findByIdAndUpdate(
          req.user.id,
          { $inc: { 'phoneVerify.attempts': 1 } },
          { new: true, upsert: true }
        )
        .select('phoneVerify.verfied +phoneVerify.attempts')
        .then((user) => {
          // Check if user has exceeded the max number of OTP attempts
          if (
            user.phoneVerify.attempts >= 4 ||
            user.phoneVerify.verified === true
          ) {
            // return false in case attempts are exceeded
            return false
          }
          // set mobile number & OTP number generated to User model
          user.phone = req.params.number
          user.phoneVerify.otp = otpGen
          // eslint-disable-next-line consistent-return
          user.save((err) => {
            if (err) {
              return res.status(500).json({ error: 'Cannot save OTP' })
            }
          })
          return true
        })
      // Check if user is spamming
      if (userCheck) {
        otpResp = await sendSms({
          message: `Your secret OTP is ${otpGen} - Quarantine Aid team`,
          phone: req.params.number
        })
        res.status(201).json(otpResp)
      } else {
        res
          .status(400)
          .json({ error: 'Too many OTP requests, try again later' })
      }
    } else {
      res.status(400).json({
        error: 'invalid phone number'
      })
    }
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verifyOtp = async (req, res) => {
  try {
    const otpVerfied = await model
      .findById(req.user.id)
      .select('phoneVerify.verfied phone +phoneVerify.otp')
      .then((user, err) => {
        if (err) {
          console.log(err)
          return { verfied: false, err }
        }
        if (user.phoneVerify.otp === req.body.otp) {
          user.phoneVerify.verified = true
          // eslint-disable-next-line consistent-return
          user.save((error) => {
            if (error) {
              return res.status(500).json({ error: 'Cannot verify OTP' })
            }
          })
          return {
            verfied: true,
            phone: user.phone
          }
        }
        return { verfied: false }
      })
    res.status(200).json(otpVerfied)
  } catch (error) {
    utils.handleError(res, error)
  }
}
