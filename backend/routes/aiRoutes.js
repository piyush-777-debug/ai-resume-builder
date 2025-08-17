const express = require('express');
const router = express.Router();
const { generateCoverLetter } = require('../controllers/aiControllers')
const isLoggedIn  = require('../middlewares/authMiddleware')

router.post('/cover-letter',isLoggedIn,generateCoverLetter);

module.exports = router;