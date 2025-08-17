const express = require('express');
const router = express.Router();
const { getResumes, createResume, DeleteResume, getResumesById, DownloadResume } = require('../controllers/resumeControllers');
const isLoggedIn = require('../middlewares/authMiddleware');

router.post('/create',isLoggedIn, createResume);
router.get('/',isLoggedIn, getResumes);
router.get('/:id',isLoggedIn,getResumesById);
router.delete('/:id',isLoggedIn,DeleteResume);
router.get("/download/:id", isLoggedIn, DownloadResume);


module.exports = router;