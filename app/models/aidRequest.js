const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const options = {
  collection: 'AidRequest',
  timestamps: { createdAt: '_created_at', updatedAt: '_updated_at' },
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
  versionKey: false,
  upsert: true,
  usePushEach: true
}

const GeoJson = new mongoose.Schema({
  geometry: {
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    type: {
      type: String
    }
  },
  type: {
    type: String
  },
  properties: {
    type: Object,
    index: true
  }
})

const AidRequestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['food', 'medicines', 'masks', 'other'],
      index: true,
      required: true
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    volunteers: {
      acceptedByRequester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      acceptedByVolunteer: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      resolvedByRequester: {
        type: Boolean,
        default: false
      },
      resolvedByVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rejectedByVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rejectedByRequester: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    images: [String],
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    geojson: GeoJson,
    phone: {
      type: String,
      required: true
    },
    sharedContact: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'new',
      enum: ['new', 'ongoing', 'inprogress', 'resolved', 'disabled']
    }
  },
  options
)
AidRequestSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('AidRequest', AidRequestSchema)
