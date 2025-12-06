const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  getIncidentStats
} = require('../controllers/incident.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

// Statistics route (admin only)
router.get('/stats/overview', isAdmin, getIncidentStats);

// Main incident routes
router.route('/')
  .get(getIncidents)
  .post(createIncident);

router.route('/:id')
  .get(getIncidentById)
  .put(updateIncident)
  .delete(deleteIncident);

module.exports = router;
