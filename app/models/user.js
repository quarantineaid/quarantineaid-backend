const mongoose = require('mongoose')
const validator = require('validator')
const mongoosePaginate = require('mongoose-aggregate-paginate-v2')

const Schema = mongoose.Schema

const options = {
  collection: 'User',
  timestamps: { createdAt: '_created_at', updatedAt: '_updated_at' },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  versionKey: false,
  usePushEach: true
}

const UserSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      trim: true,
      unique: true,
      required: false
    },
    facebookProvider: {
      type: {
        id: { type: String, unique: true },
        token: String
      },
      select: false
    },
    googleProvider: {
      type: {
        id: { type: String, unique: true },
        token: String
      },
      select: false
    },
    picture: {
      type: String
    },
    phone: {
      type: Number,
      select: false
    },
    phoneVerify: {
      otp: {
        type: Number,
        default: 0,
        select: false
      },
      verified: {
        type: Boolean,
        default: false,
        select: true
      },
      attempts: {
        type: Number,
        default: 0,
        select: false
      }
    },
    status: {
      type: String,
      enum: ['active', 'banned', 'deactivated', 'deleted']
    }
  },
  options
)

UserSchema.statics.upsertFbUser = function (
  accessToken,
  refreshToken,
  profile,
  cb
) {
  return this.findOne(
    {
      'facebookProvider.id': profile.id
    },
    // eslint-disable-next-line consistent-return
    (err, user) => {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new this({
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          email: profile.emails[0].value ? profile.emails[0].value : undefined,
          picture: profile.photos[0].value,
          facebookProvider: {
            id: profile.id,
            token: accessToken
          }
        })
        newUser.save((error, savedUser) => {
          if (error) {
            console.log(error)
          }
          return cb(error, savedUser)
        })
      } else {
        return cb(err, user)
      }
    }
  )
}

UserSchema.statics.upsertGoogleUser = function (profile, accessToken, cb) {
  profile = profile.payload
  return this.findOne(
    {
      'googleProvider.id': accessToken
    },
    // eslint-disable-next-line consistent-return
    (err, user) => {
      // no user was found, lets create a new one
      if (!user) {
        const newUser = new this({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          googleProvider: {
            id: accessToken
          }
        })

        newUser.save((error, savedUser) => {
          if (error) {
            console.log(error)
          }
          return cb(error, savedUser)
        })
      } else {
        return cb(err, user)
      }
    }
  )
}

UserSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('User', UserSchema)
