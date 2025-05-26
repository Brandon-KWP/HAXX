const express = require('express');
const router = express.Router();

/* ------------------------------ */

const userController = require('../controllers/c-user.js');
const isAuth = require('../middleware/isAuth');

/* ------------------------------ */

// Routes protégées par authentification
router.get('/profile', isAuth, userController.getProfile);
router.get('/profile/edit', isAuth, userController.getEditProfile);
router.post('/profile/edit', isAuth, userController.updateProfile);

router.get('/logout', isAuth, userController.logout);

/* ------------------------------ */

module.exports = router;