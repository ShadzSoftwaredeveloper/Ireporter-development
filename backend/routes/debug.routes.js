const express = require('express');
const router = express.Router();
const { checkEmail } = require('../controllers/debug.controller');

// GET /api/debug/email-test
router.get('/email-test', checkEmail);

// POST /api/debug/send-test-email
router.post('/send-test-email', require('express').json(), (req, res, next) => {
	// forward to controller
	const controller = require('../controllers/debug.controller');
	return controller.sendTestEmail(req, res, next);
});

module.exports = router;
