const express = require('express');
const router = express.Router();
const { signup, signin, getMe, updateProfile } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes (non-OTP legacy)
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
