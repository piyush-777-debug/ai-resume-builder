const express = require('express');
const router = express.Router();
const { RegisterUser, LoginUser, LogoutUser } = require('../controllers/authControllers'); 

router.post('/register',RegisterUser);
router.post('/login',LoginUser);
router.get('/logout',LogoutUser);

module.exports = router;