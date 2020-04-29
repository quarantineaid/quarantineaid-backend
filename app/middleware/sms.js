const twilioClient = require('twilio')(
  process.env.TWILIO_ACC_SID,
  process.env.TWILIO_AUTH_TOKEN
)

exports.phoneValidate = (phoneNumber) => {
  const re = /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/
  return re.test(phoneNumber)
}

/**
 * Sends sms
 * @param {Object} data - data
 */
exports.sendSms = async (data) => {
  return new Promise((resolve) => {
    twilioClient.messages
      .create({
        body: data.message,
        from: process.env.TWILIO_NUMBER,
        to: data.phone
      })
      .then((message) => {
        resolve({ msg: 'Message Sent Successfully!' })
      })
      .catch((err) => {
        console.error(err)
      })
  })
}
