const controller = require('../controllers/aidRequest')
const validate = require('../controllers/aidRequest.validate')
const authCheck = require('../middleware/auth')
const express = require('express')
const router = express.Router()
require('../../config/passport')
const trimRequest = require('trim-request')

/*
 * Create new aidRequest route
 */
router.post(
  '/new',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.newSituation
)

/*
 * Fetch all helping/situations
 */
router.get(
  '/helping/all',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.allSituations
)

/*
 * get all volunteer situations
 */
router.get(
  '/helping/ongoing',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.onGoingSituations
)

/*
 * get all volunteer situations
 */
router.get(
  '/helping/pending',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.pendingSituations
)

/*
 * Fetch a particluar helping/situations
 */
router.get(
  '/helping/:situationId',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.getSituation
)

/*
 * volunteer for a particluar situation
 */
router.post(
  '/helping/volunteer',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.volunteer
)

/*
 * set volunteer status on situation
 */
router.post(
  '/helping/status',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.volunteerStatus
)

module.exports = router
