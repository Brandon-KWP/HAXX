const express = require('express');
const router = express.Router();

/* ------------------------------ */

const notificationController = require('../controllers/c-notification.js');
const isAuth = require('../middleware/isAuth.js');

/* ------------------------------ */

router.get('/notifications', isAuth, notificationController.getNotifications);

/* ------------------------------ */

module.exports = router;