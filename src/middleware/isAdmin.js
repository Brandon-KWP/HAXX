const express = require('express');
const router = express.Router();

/* ------------------------------ */

const isAdmin = (req, res, next) => {
    // Vérifier si l'utilisateur est connecté
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    // Vérifier si l'utilisateur est un admin
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', { 
            message: 'Accès non autorisé. Vous devez être administrateur.' 
        });
    }
    
    next();
};

/* ------------------------------ */

module.exports = isAdmin;