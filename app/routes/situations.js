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
 * get all volunteer situations
 */
router.get(
  '/helping/helped',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.helpedSituations
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

/*
 * get all ongoing getting-help on situation
 */
router.get(
  '/getting-help/ongoing',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.ghOnGoingSituations
)

/*
 * get all pending getting-help on situation
 */
router.get(
  '/getting-help/pending',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.ghPendingSituations
)

/*
 * get all pending getting-help on situation
 */
router.get(
  '/getting-help/resolved',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.ghResolvedSituations
)

/*
 * get all pending getting-help on situation
 */
router.post(
  '/getting-help/accept',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.acceptHelp
)

/*
 * get all pending getting-help on situation
 */
router.post(
  '/getting-help/status',
  authCheck.isAuthenticated(),
  trimRequest.all,
  controller.acceptedhelpStatus
)

module.exports = router
