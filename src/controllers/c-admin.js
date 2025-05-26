const express = require("express");
const app = express();

/* ------------------------------ */

const Event = require("../models/m-event.js");
const Project = require("../models/m-projet.js");
const Member = require("../models/m-auth.js");

/* ------------------------------ */

exports.dashboard = async (req, res) => {
    try {
        const events = await Event.find().limit(5);
        const projects = await Project.find().limit(5);
        const members = await Member.find().limit(5);
        res.render('admin/dashboard', { events, projects, members });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.render('admin/events', { events });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

exports.addEvent = async (req, res) => {
    try {
        console.log("Données reçues:", req.body); // Pour déboguer

        const { nom, image, description, date, ville, places_available } = req.body;

        const newEvent = new Event({
            nom,
            image,
            description,
            date,
            ville,
            places_available: parseInt(places_available)
        });

        console.log("Nouvel événement:", newEvent); // Pour déboguer

        await newEvent.save();

        res.status(201).json({ 
            message: "Événement créé avec succès",
            event: newEvent 
        });
    } catch (error) {
        console.error("Erreur création événement:", error);
        res.status(500).json({ 
            message: "Erreur lors de la création de l'événement",
            error: error.message 
        });
    }
};

exports.editEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        res.status(200).json({ message: 'Événement modifié avec succès', event: updatedEvent });
    } catch (error) {
        console.error('Erreur de modification:', error);
        res.status(500).json({ message: 'Erreur lors de la modification' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/admin/events');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Gérer les projets
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.render('admin/projects', { projects });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

exports.editProject = async (req, res) => {
    try {
        await Project.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/projects');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.redirect('/admin/projects');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Afficher la page des membres
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.render('admin/members', { members });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Modifier un membre
exports.updateMember = async (req, res) => {
    try {
        await Member.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/members');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Supprimer un membre
exports.deleteMember = async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.redirect('/admin/members');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};