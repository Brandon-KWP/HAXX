const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

/*--------------------------------*/

const User = require('../models/m-auth.js');

/* ------------------------------ */

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id)
            .populate('events')
            .populate('notifications');

        if (!user) {
            return res.status(404).render('error', { 
                message: "Utilisateur non trouvé" 
            });
        }

        res.render('user/profile', { user });
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).render('error', { 
            message: "Erreur lors de la récupération du profil" 
        });
    }
};

exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        
        if (!user) {
            return res.status(404).render('error', { 
                message: "Utilisateur non trouvé" 
            });
        }

        res.render('user/edit-profile', { user });
    } catch (error) {
        console.error('Erreur édition profil:', error);
        res.status(500).render('error', { 
            message: "Erreur lors de la récupération du profil" 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { pseudo, pseudo_ubisoft, pseudo_discord, email, password } = req.body;
        const userId = req.session.user.id;

        // Vérifier si les pseudos sont déjà utilisés par d'autres utilisateurs
        const existingUser = await User.findOne({
            _id: { $ne: userId },
            $or: [
                { pseudo_ubisoft },
                { pseudo_discord },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: "Ce pseudo Ubisoft, Discord ou email est déjà utilisé" 
            });
        }

        // Préparer l'objet de mise à jour
        const updateData = {
            pseudo,
            pseudo_ubisoft,
            pseudo_discord,
            email
        };

        // Si un nouveau mot de passe est fourni, le hasher
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 12);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                message: "Utilisateur non trouvé" 
            });
        }

        // Mise à jour de la session
        req.session.user = {
            ...req.session.user,
            pseudo: updatedUser.pseudo,
            pseudo_ubisoft: updatedUser.pseudo_ubisoft,
            pseudo_discord: updatedUser.pseudo_discord,
            email: updatedUser.email
        };

        res.status(200).json({
            message: "Profil mis à jour avec succès",
            redirect: '/profile'
        });

    } catch (error) {
        console.error('Erreur mise à jour profil:', error);
        res.status(500).json({ 
            message: "Erreur lors de la mise à jour du profil",
            error: error.message 
        });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur déconnexion:', err);
            return res.status(500).render('error', { 
                message: "Erreur lors de la déconnexion" 
            });
        }
        res.redirect('/');
    });
};