const express = require("express");
const router = express.Router();

/* ------------------------------ */

// Pour la page de l'acceuille
router.get("/", async (req, res) => {
    res.render("index");
});

// Pour la page des membres
router.get("/membres", async (req, res) => {
    res.render("membre");
});

/* ------------------------------ */

// exporation des routes
module.exports = router;