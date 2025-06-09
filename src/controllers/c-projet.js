const express = require("express");
const app = express();

/* ------------------------------ */

const Project = require("../models/m-projet.js");

/* ------------------------------ */

exports.addProject = async (req, res) => {
    try {
        const { name, image, date, cards } = req.body;

        const newProject = new Project({
            name,
            image,
            date,
            cards
        });

        await newProject.save();
 
        res.status(201).json({ 
            message: "Projet créé avec succès",
            project: newProject
        });
    } catch (error) {
        console.error('Erreur création projet:', error);
        res.status(500).json({ 
            message: "Erreur lors de la création du projet",
            error: error.message 
        });
    }
};