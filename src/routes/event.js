const express = require("express");
const router = express.Router();

/* ------------------------------ */

const isAuth = require("../middleware/isAuth");
const eventController = require("../controllers/c-event.js");

/* ------------------------------ */

// pour la page d'Evenement
router.get("/evenement", eventController.getViewsEvent);

// pour la page d'Evenement detaillée
router.get("/evenement/:id", eventController.getEventById);

router.post("/evenement/:id/register", isAuth, eventController.registerForEvent);

/* ------------------------------ */

module.exports = router;