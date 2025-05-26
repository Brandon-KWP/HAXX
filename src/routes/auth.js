const express = require("express");
const router = express.Router();

/* ------------------------------ */

const isAuth = require("../middleware/isAuth");
const authController = require("../controllers/c-auth.js");

/* ------------------------------ */

// Routes pour la connexion
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

// Routes pour l'inscription
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.postRegister);

// Route pour le mot de passe oublié
router.post('/auth/forgot-password', authController.forgotPassword);

/* ------------------------------ */

module.exports = router;