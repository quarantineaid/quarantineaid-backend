const controller = require('../controllers/aidRequest')
const express = require('express')
const router = express.Router()
const trimRequest = require('trim-request')

/*
 * Get all occurrences
 */
router.get('/all', trimRequest.all, controller.allOccurrences)

module.exports = router
