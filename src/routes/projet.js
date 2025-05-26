const express = require("express");
const router = express.Router();

/* ------------------------------ */

// Pour la page des projet
router.get("/project", async (req, res) => {
    res.render("project");
});

/* ------------------------------ */

// exporation des routes
module.exports = router;