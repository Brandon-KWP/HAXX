const express = require("express");
const app = express();

/* ------------------------------ */

const mongoose = require('mongoose');
const Event = require("../models/m-event.js");
const User = require("../models/m-auth.js");
const Notification = require("../models/m-notification.js");

/* ------------------------------ */

exports.getAddEvent = async (req, res) => {
    console.log("Donnée événement reçue :", req.body);
    try {
        const { title, cover, description, date, city, place_available } = req.body;

        if (!title || !description || !date || !cover) {
            return res.status(400).json({ message: "Les champs title, description, date et cover sont obligatoires.",});
        }

        const newEvent = new Event({
            title,
            cover,
            description,
            date,
            city,
            place_available
        });

        console.log("Nouvel événement créé :", newEvent);

        await newEvent.save();
        res.status(201).json({ message: "Événement créé avec succès.", event: newEvent });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'événement :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
}

// Afficher tous les événements
exports.getViewsEvent = async (req, res) => {
    try {
        const events = await Event.find();
        res.render('event/index', { events });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).render('error', { 
            message: "Erreur lors de la récupération des événements" 
        });
    }
};

// Afficher un événement spécifique
exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log("ID reçu:", eventId);

        // Vérifier si l'ID est valide pour MongoDB
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            console.log("ID invalide format MongoDB");
            return res.status(400).render('error', { 
                message: "ID d'événement invalide" 
            });
        }

        // Rechercher l'événement avec plus de détails
         const event = await Event.findById(eventId).exec();

        if (!event) {
            // console.log("Aucun événement trouvé pour l'ID:", eventId);
            return res.status(404).render('error', { 
                message: "L'événement n'a pas été trouvé" 
            });
        }

        res.render('event/detail', { event });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).render('error', { 
            message: "Erreur lors de la récupération de l'événement" 
        });
    }
};

exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.session.userId;

        console.log("Tentative d'inscription - EventID:", eventId, "UserID:", userId);
        
        const event = await Event.findById(eventId);
        const user = await User.findById(userId);

        if (!userId) {
            return res.status(401).json({ 
                message: "Vous devez être connecté pour vous inscrire à un événement" 
            });
        }

        if (!event || !user) {
            return res.status(404).json({ 
                message: "Événement ou utilisateur non trouvé",
            });
        }
 
        if (event.places_available <= 0) {
            return res.status(400).json({ message: "Plus de places disponibles" });
        }

        // Vérifier si l'utilisateur n'est pas déjà inscrit
        if (event.participants && event.participants.includes(userId)) {
            return res.status(400).json({ message: "Vous êtes déjà inscrit à cet événement" });
        }

        // Création de la notification
        const notification = new Notification({
            user: userId,
            message: `Vous êtes inscrit à l'événement : ${event.nom}`,
            type: 'event',
            event: eventId,
            read: false
        });

        await notification.save();
        console.log("Notification créée", notification);

        // Mise à jour de l'utilisateur avec la nouvelle notification
        user.notifications = user.notifications || [];
        user.notifications.push(notification._id);
        await user.save();

        // Mise à jour de la session
        req.session.user.notifications = user.notifications;

        // Mettre à jour l'événement
        if (!event.participants) event.participants = [];
        event.participants.push(userId);
        event.places_available -= 1;
        await event.save();
        console.log("Événement mis à jour");

        // Mettre à jour le profil utilisateur
        if (!user.events) user.events = [];
        if (!user.notifications) user.notifications = [];
        user.events.push(eventId);
        user.notifications.push(notification._id);
        await user.save();
        console.log("Utilisateur mis à jour");

        res.status(200).json({ 
            message: "Inscription réussie",
            notification: notification
        });
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        res.status(500).json({ 
            message: "Erreur lors de l'inscription",
            error: error.message 
        });
    }
};