/* eslint-disable camelcase */
const model = require('../models/aidRequest')
const path = require('path')
const utils = require('../middleware/utils')
const db = require('../middleware/db')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const util = require('util')

aws.config.update({
  accessKeyId: process.env.S3_BUCKET_CLIENT,
  secretAccessKey: process.env.S3_BUCKET_SECRET
})

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint(process.env.S3_BUCKET_REGION)
const s3 = new aws.S3({
  endpoint: spacesEndpoint
})

// eslint-disable-next-line consistent-return
const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  }
  cb('Error: Images Only!')
}

const createAidRequest = async (req) => {
  return new Promise((resolve, reject) => {
    const aidRequest = new model({
      type: req.body.data.type,
      title: req.body.data.title,
      images: req.images,
      requester: req.user.id,
      description: req.body.data.description,
      phone: req.body.data.phone,
      geojson: req.body.data.geojson
    })
    aidRequest.save((err, item) => {
      console.log(err)
      if (err) {
        reject(utils.buildErrObject(422, err.message))
      }
      resolve(item.toObject())
    })
  })
}

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    acl: 'public-read',
    key(request, file, cb) {
      const imgurl = `${new Date()
        .toISOString()
        .slice(0, 10)
        .toString()}/${Date.now()}.${file.originalname.split('.').pop()}`
      request.images.push(`${process.env.S3_BUCKET_CDN}/${imgurl}`)
      // eslint-disable-next-line callback-return
      cb(null, imgurl)
    }
  }),
  limits: {
    fileSize: 6000000
  }, // In bytes: 6000000 bytes = 6 MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb)
  }
}).array('upload', 3)

/**
 * Create aidRequest function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
//  */
exports.newSituation = async (req, res) => {
  try {
    req.images = []
    // eslint-disable-next-line consistent-return
    const _upload = util.promisify(upload)
    // res.status(201).json(await createAidRequest(req))
    await _upload(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      let finalResp = null
      if (typeof req.body.data !== 'object') {
        req.body.data = JSON.parse(req.body.data)
        finalResp = await createAidRequest(req)
      }
      if (finalResp) {
        return res.status(201).json(finalResp)
      }
      return res.status(400).json()
    })
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get all situations function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.allSituations = async (req, res) => {
  try {
    const query = {}
    if (req.query.type) {
      query.type = req.query.type.split(',')
    }
    if (req.query.city) {
      query['geojson.properties.city'] = req.query.city
    }
    if (req.query.longitude && req.query.latitude) {
      const maxDistance = req.query.maxKmDistance * 1000
      query['geojson.geometry.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [req.query.longitude, req.query.latitude]
          },
          $maxDistance: maxDistance
        }
      }
    }
    query.requester = { $ne: req.user.id }
    query['volunteers.acceptedByVolunteer'] = { $ne: req.user.id }
    res.status(200).json(await db.getItems(req, model, query))
    return
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get all ongoing/volunteered situations function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.onGoingSituations = async (req, res) => {
  try {
    const query = {}
    if (req.query.type) {
      query.type = req.query.type.split(',')
    }
    if (req.query.city) {
      query['geojson.properties.city'] = req.query.city
    }
    query.requester = { $ne: req.user.id }
    query['volunteers.acceptedByVolunteer'] = req.user.id
    const options = {
      populate: 'volunteers.acceptedByVolunteer'
    }
    res.status(200).json(await db.getItems(req, model, query, options))
    return
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get all pending/volunteered situations function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.pendingSituations = async (req, res) => {
  try {
    const query = {}
    if (req.query.type) {
      query.type = req.query.type.split(',')
    }
    if (req.query.city) {
      query['geojson.properties.city'] = req.query.city
    }
    query.requester = { $ne: req.user.id }
    query['volunteers.resolvedByVolunteer'] = req.user.id
    const options = {
      populate: 'volunteers.resolvedByVolunteer'
    }
    res.status(200).json(await db.getItems(req, model, query, options))
    return
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * volunteer for an aid request function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.volunteer = async (req, res) => {
  try {
    const situationId = await utils.isIDGood(req.body.situationId)
    const setVolunteer = {
      'volunteers.acceptedByVolunteer': req.user.id
    }
    const pushVolunteer = {
      $push: setVolunteer
    }
    res.status(200).json(await db.updateItem(situationId, model, pushVolunteer))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get all ongoing/volunteered situations function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.volunteerStatus = async (req, res) => {
  try {
    const situationId = await utils.isIDGood(req.body.situationId)
    let setVolunteer = {}
    if (req.body.resolved === true) {
      setVolunteer = {
        'volunteers.resolvedByVolunteer': req.user.id
      }
    } else {
      setVolunteer = {
        'volunteers.rejectedByVolunteer': req.user.id
      }
    }
    const pushVolunteer = {
      $push: setVolunteer
    }
    res.status(200).json(await db.updateItem(situationId, model, pushVolunteer))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get all occurrences function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.allOccurrences = async (req, res) => {
  try {
    const query = {}
    if (req.query.type) {
      query.type = req.query.type.split(',')
    }
    if (req.query.city) {
      query['geojson.properties.city'] = req.query.city
    }
    res.status(200).json(await db.getItems(req, model, query))
    return
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Get situation function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getSituation = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.situationId)
    res.status(200).json(await db.getItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteSituation = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.body.situationid)
    res.status(200).json(await db.deleteItem(id, model))
  } catch (error) {
    utils.handleError(res, error)
  }
}
