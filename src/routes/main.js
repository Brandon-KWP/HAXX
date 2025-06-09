const express = require("express");
const router = express.Router();

/* ------------------------------ */

const mainController = require("../controllers/c-main.js");


/* ------------------------------ */

// Pour la page de l'acceuille
router.get("/", mainController.getHome);

// Pour la page des membres
router.get("/membres", async (req, res) => {
    res.render("membre");
});

/* ------------------------------ */

// exporation des routes
module.exports = router;