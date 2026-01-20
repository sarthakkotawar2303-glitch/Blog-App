const express = require('express');
const { SignUpUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Auth routes
router.post('/signup', SignUpUser);
router.post('/login', loginUser);

module.exports = router;
