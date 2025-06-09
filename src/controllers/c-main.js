const express = require("express");
const app = express();

/* ------------------------------ */

const mongoose = require('mongoose');
const Event = require("../models/m-event.js");
const Project = require("../models/m-projet.js");
const Member = require("../models/m-auth.js");

/* ------------------------------ */

exports.getHome = async (req, res) => {
    try {
        const [events, projects] = await Promise.all([
            Event.find().sort({ date: 1 }).limit(5),
            Project.find().sort({ date: -1 }).limit(5)
        ]);

        res.render('index', {  // Modifié ici
            events,
            projects,
            title: 'Accueil - HAXX'
        });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).render('error', { 
            message: 'Erreur lors du chargement de la page' 
        });
    }
};